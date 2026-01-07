import { readFile } from "node:fs/promises";
import { join } from "node:path";

export default defineEventHandler(async () => {
  const file = join(process.cwd(), "public", "roadmap.json");
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw);
});
