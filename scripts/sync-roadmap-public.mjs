// scripts/sync-roadmap-public.mjs
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("data/roadmap.json");
const DEST = path.resolve("public/roadmap.json");

if (!fs.existsSync(SRC)) {
  console.error(`[sync-roadmap] Missing source file: ${SRC}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.copyFileSync(SRC, DEST);

console.log(`[sync-roadmap] Copied ${SRC} -> ${DEST}`);
