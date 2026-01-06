import type { RoadmapNode } from "~/types/roadmap";

type TopoIndex = Map<string, number>;

function norm(id: string) {
  return String(id).trim().toUpperCase();
}

function numOr(n: unknown, fallback: number) {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

export function buildTopoIndex(nodes: RoadmapNode[]): TopoIndex {
  const byId = new Map<string, RoadmapNode>();
  for (const n of nodes) byId.set(norm(n.id), n);

  const indeg = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const n of nodes) {
    const id = norm(n.id);
    indeg.set(id, 0);
    adj.set(id, []);
  }

  for (const n of nodes) {
    const to = norm(n.id);
    for (const rawP of n.prereqIds || []) {
      const p = norm(rawP);
      if (!byId.has(p)) continue;
      indeg.set(to, (indeg.get(to) ?? 0) + 1);
      adj.get(p)?.push(to);
    }
  }

  const seqById = new Map<string, number>(
    nodes.map((n) => [norm(n.id), numOr(n.seq, 999999)])
  );

  const cmp = (a: string, b: string) =>
    (seqById.get(a) ?? 999999) - (seqById.get(b) ?? 999999) ||
    a.localeCompare(b);

  const queue: string[] = [];
  for (const [id, d] of indeg) if (d === 0) queue.push(id);
  queue.sort(cmp);

  const topo = new Map<string, number>();
  let i = 0;

  while (queue.length) {
    const id = queue.shift();
    if (!id) break;

    topo.set(id, i++);

    for (const dep of adj.get(id) ?? []) {
      indeg.set(dep, (indeg.get(dep) ?? 0) - 1);
      if (indeg.get(dep) === 0) {
        queue.push(dep);
        queue.sort(cmp);
      }
    }
  }

  if (topo.size !== nodes.length) {
    const missing = nodes
      .map((n) => norm(n.id))
      .filter((id) => !topo.has(id))
      .sort(cmp);

    for (const id of missing) topo.set(id, i++);
  }

  return topo;
}

export function getNextBestNode(args: {
  nodes: RoadmapNode[];
  topoIndex: TopoIndex;
  completedIds: Set<string>; // normalized uppercase
  canUnlock: (node: RoadmapNode) => boolean;
  preferredCategory?: string | null;
}): RoadmapNode | null {
  const { nodes, topoIndex, completedIds, canUnlock, preferredCategory } = args;
  const pref = preferredCategory?.trim() ? preferredCategory.trim() : null;

  const candidates: RoadmapNode[] = nodes.filter((n) => {
    const id = norm(n.id);
    if (completedIds.has(id)) return false;
    return canUnlock(n);
  });

  if (candidates.length === 0) return null;

  function score(n: RoadmapNode) {
    const id = norm(n.id);
    const topo = topoIndex.get(id) ?? 1_000_000;
    const categoryPenalty = pref && n.category !== pref ? 1 : 0;
    const level = Number.isFinite(n.level) ? n.level : 999;
    const seq = Number.isFinite(n.seq) ? n.seq : 999999;
    return [topo, categoryPenalty, level, seq, id] as const;
  }

  candidates.sort((a, b) => {
    const [aTopo, aCat, aLevel, aSeq, aId] = score(a);
    const [bTopo, bCat, bLevel, bSeq, bId] = score(b);

    if (aTopo !== bTopo) return aTopo - bTopo;
    if (aCat !== bCat) return aCat - bCat;
    if (aLevel !== bLevel) return aLevel - bLevel;
    if (aSeq !== bSeq) return aSeq - bSeq;

    return aId.localeCompare(bId);
  });
  return candidates[0] ?? null;
}
