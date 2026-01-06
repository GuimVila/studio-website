// scripts/generate-roadmap-json.mjs
import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

const XLSX_PATH = path.resolve("data/roadmap_estudi_so.xlsx");
const OUT_PATH = path.resolve("data/roadmap.json");
const SHEET_NAME = "Roadmap_Master";

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

if (!fs.existsSync(XLSX_PATH)) {
  fail(`Missing file: ${XLSX_PATH}`);
}

const wb = xlsx.readFile(XLSX_PATH);
if (!wb.SheetNames.includes(SHEET_NAME)) {
  fail(`Missing sheet "${SHEET_NAME}". Found: ${wb.SheetNames.join(", ")}`);
}

const sheet = wb.Sheets[SHEET_NAME];
const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

function cleanText(v) {
  if (v === null || v === undefined) return "";
  const s = String(v).trim();
  if (!s) return "";
  const low = s.toLowerCase();
  if (low === "undefined" || low === "null" || low === "nan") return "";
  return s;
}

function getFirst(r, keys) {
  for (const k of keys) {
    // exact
    if (Object.prototype.hasOwnProperty.call(r, k)) {
      const val = cleanText(r[k]);
      if (val) return val;
      // keep looking if empty
    }
    // sometimes Excel headers get extra spaces
    const foundKey = Object.keys(r).find((rk) => rk.trim() === k.trim());
    if (foundKey) {
      const val = cleanText(r[foundKey]);
      if (val) return val;
    }
  }
  return "";
}

function toInt(v) {
  const s = cleanText(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function parsePrereqs(value) {
  const s = cleanText(value);
  if (!s) return [];
  return s
    .split(/[,;]+/)
    .map((x) => cleanText(x).toUpperCase())
    .filter(Boolean);
}

function slugify(input) {
  const base = cleanText(input);
  if (!base) return "";
  return base
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-+/g, "-");
}

const categoryToSlug = new Map([
  ["Fonaments transversals", "fonaments"],
  ["Llenguatge Musical", "llenguatge-musical"],
  ["Harmonia", "harmonia"],
  ["Producció", "produccio"],
  ["Gravació", "gravacio"],
  ["Edició", "edicio"],
  ["Mescla", "mescla"],
  ["Disseny de so", "disseny-de-so"],
]);

const prefixToSlug = {
  FT: "fonaments",
  LM: "llenguatge-musical",
  HA: "harmonia",
  PR: "produccio",
  GR: "gravacio",
  ED: "edicio",
  ME: "mescla",
  DS: "disseny-de-so",
};

function inferCategorySlug(category, id) {
  const direct = categoryToSlug.get(category);
  if (direct) return direct;

  const prefix = cleanText(id).split("-")[0]?.toUpperCase();
  return prefixToSlug[prefix] || "altres";
}

function normId(id) {
  return cleanText(id).toUpperCase();
}

function idToPathSegment(id) {
  return normId(id).toLowerCase();
}

// --- Header diagnostics (helps when a column name mismatch causes undefined)
const allHeaders = new Set();
for (const r of rows) Object.keys(r).forEach((k) => allHeaders.add(k));
const headersList = Array.from(allHeaders).sort();

function warnMissingColumns(expectedAnyOf) {
  const ok = expectedAnyOf.some((k) => headersList.includes(k));
  if (!ok) {
    console.warn(
      `[warn] None of these headers were found: ${expectedAnyOf.join(" | ")}`
    );
  }
}

// These are the ones we rely on most:
warnMissingColumns(["ID", "Id", "id"]);
warnMissingColumns(["Tema", "Title", "Títol"]);
warnMissingColumns(["Categoria", "Category"]);
warnMissingColumns([
  "Prerequisits (IDs)",
  "Prerequisits",
  "Prerequisites (IDs)",
]);

let fallbackSlugCount = 0;
let missingTitleCount = 0;

const nodes = rows
  .map((r) => {
    const id = normId(getFirst(r, ["ID", "Id", "id"]));
    if (!id) return null;

    const title = getFirst(r, ["Tema", "Title", "Títol"]);
    const category = getFirst(r, ["Categoria", "Category"]);
    const module = getFirst(r, ["Mòdul", "Modul", "Module"]);
    const objective = getFirst(r, [
      "Objectiu (1 frase)",
      "Objectiu",
      "Objective (1 sentence)",
      "Objective",
    ]);
    const prereqIds = parsePrereqs(
      getFirst(r, ["Prerequisits (IDs)", "Prerequisits", "Prerequisites (IDs)"])
    );

    const seq = toInt(getFirst(r, ["Seq", "SEQ", "seq"])) ?? 0;
    const level = toInt(getFirst(r, ["Nivell", "Nivel", "Level"])) ?? 0;

    const resourceType = getFirst(r, [
      "Tipus de recurs",
      "Tipus",
      "Resource Type",
    ]);
    const monetization = getFirst(r, [
      "Monetització suggerida",
      "Monetitzacio suggerida",
      "Monetization",
    ]);
    const cta = getFirst(r, ["CTA suggerida", "CTA", "Call to action"]);
    const tags = getFirst(r, ["Tags SEO", "Tags", "SEO Tags"]);
    const estMinutes = toInt(
      getFirst(r, [
        "Temps estimat (min)",
        "Temps estimat",
        "Estimated time (min)",
      ])
    );
    const measurable = getFirst(r, [
      "Resultat mesurable",
      "Measurable result",
      "Result",
    ]);
    const notes = getFirst(r, ["Notes", "Note"]);

    const categorySlug = inferCategorySlug(category, id);

    // slug source priority: explicit "Slug" column if valid -> else title -> else id
    const rawSlug = getFirst(r, ["Slug", "slug"]);
    let slug = slugify(rawSlug);

    if (!slug) {
      // title might be missing if header mismatch
      const safeTitle = cleanText(title);
      if (!safeTitle) missingTitleCount += 1;

      slug = slugify(safeTitle);
    }

    if (!slug) {
      slug = slugify(id);
      fallbackSlugCount += 1;
    }

    const pathStr = `/recursos/${categorySlug}/${idToPathSegment(id)}-${slug}`;

    return {
      id,
      seq,
      category,
      level,
      module,
      title: cleanText(title) || id, // last-resort fallback to avoid empty titles
      prereqIds,

      categorySlug,
      slug,
      path: pathStr,

      objective,
      exercise: getFirst(r, [
        "Deliverable / exercici",
        "Deliverable",
        "Exercise",
        "Exercici",
      ]),
      resourceType,
      monetization,
      cta,
      tags,
      estMinutes,
      measurable,
      notes,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.seq - b.seq);

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify({ nodes }, null, 2), "utf-8");

console.log(`Wrote ${nodes.length} nodes to ${OUT_PATH}`);
if (fallbackSlugCount) {
  console.warn(
    `[warn] ${fallbackSlugCount} nodes used fallback slug from ID (no usable Slug/Title).`
  );
}
if (missingTitleCount) {
  console.warn(
    `[warn] ${missingTitleCount} nodes had missing/empty title (check Excel header "Tema").`
  );
}
