import { readFileSync, writeFileSync } from "node:fs";
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
const [mode, job, inp, out] = process.argv.slice(2);
const master = Buffer.from(readFileSync("/tmp/.k", "utf8").trim(), "base64");
const purpose = mode === "dec" ? "src" : (process.argv[6] || "out");
const key = Buffer.from(hkdfSync("sha256", master, "cc-v1", purpose + "|" + job, 32));
const aad = Buffer.from(purpose + "|" + job + "|v1");
const data = readFileSync(inp);
if (mode === "dec") {
  const d = createDecipheriv("aes-256-gcm", key, data.subarray(0, 12)); d.setAAD(aad); d.setAuthTag(data.subarray(data.length - 16));
  writeFileSync(out, Buffer.concat([d.update(data.subarray(12, data.length - 16)), d.final()]));
} else {
  const n = randomBytes(12), c = createCipheriv("aes-256-gcm", key, n); c.setAAD(aad);
  const ct = Buffer.concat([c.update(data), c.final()]); writeFileSync(out, Buffer.concat([n, ct, c.getAuthTag()]));
}
