import { beforeAll, describe, expect, it } from "vitest";
import { rmSync } from "node:fs";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";

describe("solana: sign-in and burn credit", () => {
  const kp = nacl.sign.keyPair();
  const address = new PublicKey(kp.publicKey).toBase58();
  const MINT = "So11111111111111111111111111111111111111112";

  beforeAll(() => {
    process.env.DATABASE_URL = "file:/tmp/intern-solana.db";
    rmSync("/tmp/intern-solana.db", { force: true });
    process.env.NEXT_PUBLIC_TOKEN_ADDRESS = MINT;
    process.env.TRIAL_ORBIO_KEY = "sk-or-test";
  });

  it("accepts exactly the server's message signed by the wallet, and nothing else", async () => {
    const { solMessage, verifySol } = await import("@/intern/session");
    const issuedAt = new Date().toISOString();
    const message = solMessage({ domain: "intern.money", address, nonce: "n1", issuedAt });
    const signature = bs58.encode(nacl.sign.detached(new TextEncoder().encode(message), kp.secretKey));
    expect(verifySol({ message, signature, address, expectedNonce: "n1", expectedDomain: "intern.money" })).toBe(true);
    expect(verifySol({ message, signature, address, expectedNonce: "n2", expectedDomain: "intern.money" })).toBe(false);
    expect(verifySol({ message, signature, address, expectedNonce: "n1", expectedDomain: "evil.example" })).toBe(false);
    const other = nacl.sign.keyPair();
    const forged = bs58.encode(nacl.sign.detached(new TextEncoder().encode(message), other.secretKey));
    expect(verifySol({ message, signature: forged, address, expectedNonce: "n1", expectedDomain: "intern.money" })).toBe(false);
  });

  const fakeConn = (authority: string, amount: string, err: unknown = null) => ({
    getParsedTransaction: async () => ({
      meta: { err, preTokenBalances: [{ mint: MINT, uiTokenAmount: { decimals: 6 } }], postTokenBalances: [], innerInstructions: [] },
      transaction: { message: { instructions: [{ program: "spl-token", parsed: { type: "burnChecked", info: { mint: MINT, authority, tokenAmount: { amount } } } }] } },
    }),
  });
  const price = (usd: number) => (async () => new Response(JSON.stringify({ pairs: [{ chainId: "solana", priceUsd: String(usd), liquidity: { usd: 1e5 } }] }))) as unknown as typeof fetch;
  const SIG = "5".repeat(88);

  it("credits a burn once, at the market price, to the wallet that burned", async () => {
    const { creditBurn } = await import("@/intern/solana");
    const { trialOf } = await import("@/intern/trial");
    const owner = address.toLowerCase();
    const r = await creditBurn(owner, SIG, { conn: fakeConn(address, "2000000000") as never, fetch: price(0.0025) });
    expect(r.creditUsd).toBeCloseTo(5, 6); // 2,000 tokens × $0.0025
    const again = await creditBurn(owner, SIG, { conn: fakeConn(address, "2000000000") as never, fetch: price(0.0025) });
    expect(again.creditUsd).toBe(0);
    const t = await trialOf(owner);
    expect(t?.active).toBe(true);
    expect(t?.remainingUsd).toBeCloseTo(5, 6);
  });

  it("refuses someone else's burn and a failed transaction", async () => {
    const { creditBurn } = await import("@/intern/solana");
    const stranger = new PublicKey(nacl.sign.keyPair().publicKey).toBase58();
    await expect(creditBurn(address.toLowerCase(), "6".repeat(88), { conn: fakeConn(stranger, "1000000") as never, fetch: price(1) })).rejects.toThrow(/no burn/);
    await expect(creditBurn(address.toLowerCase(), "7".repeat(88), { conn: fakeConn(address, "1000000", { e: 1 }) as never, fetch: price(1) })).rejects.toThrow(/no burn/);
  });

  it("runs bill the burn credit through the platform key", async () => {
    const { orbioFor } = await import("@/intern/scheduler");
    const client = await orbioFor(address.toLowerCase());
    const bal = await client!.getBalance();
    expect(bal.availableUsd).toBeCloseTo(5, 6);
    expect((await client!.createKey("run")).key).toBe("sk-or-test");
  });
});
