import { describe, expect, it } from "vitest";
import { privateKeyToAccount } from "viem/accounts";
import { newNonce, openSession, sealSession, siweMessage, verifySiwe } from "@/intern/session";

describe("siwe sessions", () => {
  const acct = privateKeyToAccount(`0x${"11".repeat(32)}`);

  it("accepts a correctly signed message and rejects tampering", async () => {
    const nonce = newNonce();
    const message = siweMessage({ domain: "intern.sky", uri: "https://intern.sky", address: acct.address, nonce, issuedAt: new Date().toISOString() });
    const signature = await acct.signMessage({ message });
    expect(await verifySiwe({ message, signature, address: acct.address, expectedNonce: nonce })).toBe(true);
    expect(await verifySiwe({ message, signature, address: acct.address, expectedNonce: "other" })).toBe(false);
    const other = privateKeyToAccount(`0x${"22".repeat(32)}`);
    expect(await verifySiwe({ message, signature, address: other.address, expectedNonce: nonce })).toBe(false);
    const stale = siweMessage({ domain: "intern.sky", uri: "https://intern.sky", address: acct.address, nonce, issuedAt: new Date(Date.now() - 3600_000).toISOString() });
    expect(await verifySiwe({ message: stale, signature: await acct.signMessage({ message: stale }), address: acct.address, expectedNonce: nonce })).toBe(false);
  });

  it("a signature given to another site, a malformed date, a future date or a duplicated field is refused", async () => {
    const nonce = newNonce();
    const sign = async (message: string) => ({ message, signature: await acct.signMessage({ message }), address: acct.address, expectedNonce: nonce });
    const foreign = siweMessage({ domain: "evil.example", uri: "https://evil.example", address: acct.address, nonce, issuedAt: new Date().toISOString() });
    expect(await verifySiwe({ ...(await sign(foreign)), expectedDomain: "intern.sky", expectedUri: "https://intern.sky" })).toBe(false);
    const good = siweMessage({ domain: "intern.sky", uri: "https://intern.sky", address: acct.address, nonce, issuedAt: new Date().toISOString() });
    expect(await verifySiwe({ ...(await sign(good)), expectedDomain: "intern.sky", expectedUri: "https://intern.sky" })).toBe(true);
    expect(await verifySiwe(await sign(good.replace(/Issued At: .*/, "Issued At: yesterday-ish")))).toBe(false);
    expect(await verifySiwe(await sign(good.replace(/Issued At: .*/, `Issued At: ${new Date(Date.now() + 3600_000).toISOString()}`)))).toBe(false);
    expect(await verifySiwe(await sign(good + `\nNonce: ${nonce}`))).toBe(false);
    expect(await verifySiwe(await sign(good.replace("Chain ID: 4663", "Chain ID: 1")))).toBe(false);
    expect(await verifySiwe(await sign(good.replace(`\n${acct.address}\n`, `\n${acct.address}\n${acct.address}\n`)))).toBe(false);
  });

  it("session tokens round-trip and reject forgery", () => {
    const t = sealSession(acct.address);
    expect(openSession(t)).toBe(acct.address.toLowerCase());
    const [a, exp, mac] = t.split(".");
    expect(openSession(`${"0x" + "ff".repeat(20)}.${exp}.${mac}`)).toBeNull();
    expect(openSession(`${a}.${Number(exp) + 99999}.${mac}`)).toBeNull();
    expect(openSession("garbage")).toBeNull();
  });
});

describe("session renewal", () => {
  it("lasts 30 days and slides forward once a third is used; fresh sessions are left alone", async () => {
    const { renewedCookie, sealSession, sessionExpiry } = await import("@/intern/session");
    const addr = "0x00000000000000000000000000000000000000ab";
    const fresh = sealSession(addr);
    const exp = sessionExpiry(fresh)!;
    expect(exp - Date.now()).toBeGreaterThan(29 * 24 * 3600_000);
    expect(renewedCookie(new Request("http://x", { headers: { cookie: `intern_session=${fresh}` } }))).toBeNull();
    // forge an older-but-valid token: same address, expiry 12 days out (18 used of 30)
    const [a] = fresh.split(".");
    const oldExp = Date.now() + 12 * 24 * 3600_000;
    const { createHmac } = await import("node:crypto");
    const mac = createHmac("sha256", process.env.SECRET_KEY ?? "intern-dev-only-not-secret").update(`${a}.${oldExp}`).digest("base64url");
    const aged = `${a}.${oldExp}.${mac}`;
    const renewed = renewedCookie(new Request("http://x", { headers: { cookie: `intern_session=${aged}` } }));
    expect(renewed).toMatch(/^intern_session=0x/);
    expect(renewed).toMatch(/Max-Age=2592000/);
    expect(sessionExpiry(renewed!.split("=")[1].split(";")[0])! - Date.now()).toBeGreaterThan(29 * 24 * 3600_000);
  });
});
