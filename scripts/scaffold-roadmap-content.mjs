import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("content/recursos");
const ROADMAP_PATH = path.resolve("data/roadmap.json");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readRoadmapJson() {
  if (!fs.existsSync(ROADMAP_PATH)) {
    throw new Error(
      `Missing ${ROADMAP_PATH}. Run generate-roadmap-json.mjs first.`
    );
  }
  const raw = fs.readFileSync(ROADMAP_PATH, "utf-8");
  const data = JSON.parse(raw);
  if (!data?.nodes || !Array.isArray(data.nodes)) {
    throw new Error(`Invalid roadmap.json format. Expected { nodes: [...] }`);
  }
  return data;
}

function esc(v) {
  return String(v ?? "").replace(/"/g, '\\"');
}

function mdTemplate(n) {
  const prereqs = (n.prereqIds || []).map((x) => `"${esc(x)}"`).join(", ");

  return `---
id: "${esc(n.id)}"
title: "${esc(n.title)}"
category: "${esc(n.category)}"
categorySlug: "${esc(n.categorySlug)}"
module: "${esc(n.module)}"
level: ${Number.isFinite(n.level) ? n.level : 0}
seq: ${Number.isFinite(n.seq) ? n.seq : 0}
slug: "${esc(n.slug)}"
path: "${esc(n.path)}"
prereqIds: [${prereqs}]
resourceType: "${esc(n.resourceType)}"
estMinutes: ${Number.isFinite(n.estMinutes) ? n.estMinutes : "null"}
tags: "${esc(n.tags)}"
monetization: "${esc(n.monetization)}"
cta: "${esc(n.cta)}"
---

## Objectiu
${n.objective || ""}

## Contingut
- (Escriu el contingut aquí)

## Exercici / Deliverable
${n.exercise || ""}

## Resultat mesurable
${n.measurable || ""}

## Notes
${n.notes || ""}

`;
}

const roadmap = readRoadmapJson();

for (const n of roadmap.nodes) {
  const categorySlug = String(n.categorySlug || "altres").trim() || "altres";
  const dir = path.join(OUT_DIR, categorySlug);
  ensureDir(dir);

  const idPart = String(n.id || "").toLowerCase();
  const slugPart = String(n.slug || "").trim() || "article";
  const file = path.join(dir, `${idPart}-${slugPart}.md`);

  if (fs.existsSync(file)) continue; // no sobreescriu
  fs.writeFileSync(file, mdTemplate(n), "utf-8");
}

console.log("Scaffold completed.");
