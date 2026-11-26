// NusaData — main.ts
// Menyalin app/ dan screenshots/ ke direktori output dan menulis dossier.json
// dengan buildDossier dari vendor kit. Node 22, stdlib saja.
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const root = join(fileURLToPath(new URL(".", import.meta.url)));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    n += statSync(p).isDirectory() ? countFiles(p) : 1;
  }
  return n;
}

mkdirSync(out, { recursive: true });
for (const dir of ["app", "screenshots"]) {
  const src = join(root, dir);
  if (!existsSync(src)) throw new Error("missing directory: " + src);
  cpSync(src, join(out, dir), { recursive: true });
  const copied = countFiles(join(out, dir));
  if (copied === 0) throw new Error("nothing copied for: " + dir);
  console.log("copied " + copied + " file(s) to " + join(out, dir));
}

const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, "dossier.json"), dossier);
console.log("wrote " + join(out, "dossier.json") + " (" + dossier.length + " bytes)");
