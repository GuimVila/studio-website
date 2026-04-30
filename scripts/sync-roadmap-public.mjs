// scripts/sync-roadmap-public.mjs
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("data/roadmap.json");
const DEST = path.resolve("public/roadmap.json");

if (!fs.existsSync(SRC)) {
  console.error(`[sync-roadmap] Missing source file: ${SRC}`);
  process.exit(1);
}

const raw = fs.readFileSync(SRC, "utf-8");
const roadmap = JSON.parse(raw);
const legacyPaths = (roadmap.nodes || []).filter((node) =>
  String(node.path || "").split("/").includes("recursos")
);

if (legacyPaths.length) {
  console.error(
    `[sync-roadmap] Found ${legacyPaths.length} legacy /recursos path(s). Regenerate/fix data/roadmap.json before syncing.`
  );
  console.error(
    `[sync-roadmap] First legacy path: ${legacyPaths[0]?.path || "(missing)"}`
  );
  process.exit(1);
}

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.copyFileSync(SRC, DEST);

console.log(`[sync-roadmap] Copied ${SRC} -> ${DEST}`);
