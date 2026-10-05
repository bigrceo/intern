import { Pool, types, type PoolClient } from "pg";

/**
 * Postgres behind the libsql Client surface the store uses (execute, batch, rows, rowsAffected), so the SQLite
 * queries run unchanged on a hosted Postgres (Neon) when DATABASE_URL is postgres://. Tables live in their own
 * schema (PG_SCHEMA, default "intern") so a shared database stays tidy. Translation is narrow on purpose: it covers
 * exactly the SQLite dialect store.ts and threads-store.ts write, nothing more.
 */

// BIGINT and NUMERIC come back as JS numbers, like libsql integers and reals.
types.setTypeParser(20, (v) => Number(v));
types.setTypeParser(1700, (v) => Number(v));

type Stmt = string | { sql: string; args?: unknown[] };
type Result = { rows: Record<string, unknown>[]; rowsAffected: number; columns: string[] };

const UPSERT_KEYS: Record<string, string[]> = {
  connections: ["owner", "kind"],
  link_codes: ["code"],
  tg_messages: ["chat_id", "message_id"],
  kv: ["k"],
};

/** SQLite's two-argument MIN/MAX are scalars; Postgres calls them LEAST/GREATEST. One-argument ones stay aggregates. */
function scalarMinMax(sql: string) {
  let out = "";
  for (let i = 0; i < sql.length; i++) {
    const m = /^(MIN|MAX)\(/i.exec(sql.slice(i, i + 4));
    const prev = i > 0 ? sql[i - 1] : " ";
    if (m && !/[\w.]/.test(prev)) {
      let depth = 0, comma = false, j = i + 3;
      for (; j < sql.length; j++) {
        if (sql[j] === "(") depth++;
        else if (sql[j] === ")") { depth--; if (depth === 0) break; }
        else if (sql[j] === "," && depth === 1) comma = true;
      }
      if (comma) { out += m[1].toUpperCase() === "MIN" ? "LEAST" : "GREATEST"; i += 2; continue; }
    }
    out += sql[i];
  }
  return out;
}

/** "INSERT INTO t … WHERE (SELECT COUNT(*) FROM t …) < cap": atomic under SQLite's single writer, racy under Postgres. */
const guardedInsert = (sql: string) => /^\s*INSERT INTO (\w+)[\s\S]*\(SELECT COUNT\(\*\) FROM (\w+)/i.exec(sql);

export function translate(sql: string, schema = process.env.PG_SCHEMA ?? "intern"): string {
  let s = sql;
  const pragma = s.match(/^\s*PRAGMA table_info\((\w+)\)\s*$/i);
  if (pragma) return `SELECT column_name AS name FROM information_schema.columns WHERE table_schema='${schema}' AND table_name='${pragma[1]}'`;

  if (/^\s*(CREATE TABLE|ALTER TABLE)/i.test(s)) {
    s = s.replace(/\bINTEGER\b/g, "BIGINT").replace(/\bREAL\b/g, "DOUBLE PRECISION").replace(/\bBLOB\b/g, "BYTEA");
    s = s.replace(/ADD COLUMN (?!IF NOT EXISTS)/i, "ADD COLUMN IF NOT EXISTS ");
  }
  s = s.replace(/abs\(random\(\)\) % (\d+)/gi, "floor(random() * $1)::bigint");
  s = s.replace(/\binstr\(/gi, "strpos(");
  s = s.replace(/\bjson_object\(([^()]*)\)/g, "json_build_object($1)::text");
  s = scalarMinMax(s);
  s = s.replace(/\bLIKE\b/g, "ILIKE"); // SQLite LIKE ignores case

  const ignore = s.match(/^\s*INSERT OR IGNORE INTO/i);
  if (ignore) s = s.replace(/INSERT OR IGNORE INTO/i, "INSERT INTO") + " ON CONFLICT DO NOTHING";
  const replace = s.match(/^\s*INSERT OR REPLACE INTO (\w+)\s*\(([^)]*)\)/i);
  if (replace) {
    const [, table, colList] = replace;
    const keys = UPSERT_KEYS[table];
    if (!keys) throw new Error(`pg-client: no upsert key for ${table}`);
    const cols = colList.split(",").map((c) => c.trim()).filter((c) => !keys.includes(c));
    s = s.replace(/INSERT OR REPLACE INTO/i, "INSERT INTO") + ` ON CONFLICT (${keys.join(",")}) DO ${cols.length ? `UPDATE SET ${cols.map((c) => `${c}=EXCLUDED.${c}`).join(",")}` : "NOTHING"}`;
  }

  // ? placeholders → $1..$n (none of the queries carry a literal ? inside a string).
  let n = 0;
  s = s.replace(/\?/g, () => `$${++n}`);
  return s;
}

const norm = (a: unknown) => (typeof a === "boolean" ? (a ? 1 : 0) : a instanceof ArrayBuffer ? Buffer.from(a) : a === undefined ? null : a);

export function createPgClient(url: string, schema = process.env.PG_SCHEMA ?? "intern") {
  // Neon's "-pooler" host runs PgBouncer in transaction mode, which drops session settings such as search_path;
  // the direct host keeps them, and the schema is set once per connection at startup.
  const direct = url.replace(/-pooler(?=\.)/, "");
  const pool = new Pool({ connectionString: direct, max: 3, options: `-c search_path=${schema}`, idleTimeoutMillis: 10_000, ssl: url.includes("sslmode=disable") ? undefined : { rejectUnauthorized: false } });
  let schemaReady: Promise<unknown> | null = null;
  const ensureSchema = () => (schemaReady ??= pool.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`));

  const run = async (c: Pool | PoolClient, stmt: Stmt): Promise<Result> => {
    const { sql, args = [] } = typeof stmt === "string" ? { sql: stmt, args: [] } : stmt;
    const r = await c.query(translate(sql, schema), args.map(norm));
    return { rows: r.rows, rowsAffected: r.rowCount ?? 0, columns: r.fields?.map((f) => f.name) ?? [] };
  };

  return {
    async execute(stmt: Stmt) {
      await ensureSchema();
      const sql = typeof stmt === "string" ? stmt : stmt.sql;
      const g = guardedInsert(sql);
      if (!g) return run(pool, stmt);
      // Serialize capped inserts per table with a transaction-scoped advisory lock, so a burst cannot overshoot the cap.
      const c = await pool.connect();
      try {
        await c.query("BEGIN");
        await c.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`${schema}.${g[2]}`]);
        const r = await run(c, stmt);
        await c.query("COMMIT");
        return r;
      } catch (e) {
        await c.query("ROLLBACK").catch(() => undefined);
        throw e;
      } finally {
        c.release();
      }
    },
    async batch(stmts: Stmt[], _mode?: string) {
      await ensureSchema();
      const c = await pool.connect();
      try {
        await c.query("BEGIN");
        const out: Result[] = [];
        for (const s of stmts) out.push(await run(c, s));
        await c.query("COMMIT");
        return out;
      } catch (e) {
        await c.query("ROLLBACK").catch(() => undefined);
        throw e;
      } finally {
        c.release();
      }
    },
  };
}
