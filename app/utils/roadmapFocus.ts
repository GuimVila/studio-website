import type { RoadmapNode } from "~/types/roadmap";

function norm(id: string) {
  return String(id).trim().toUpperCase();
}

export function buildNodeIndex(nodes: RoadmapNode[]) {
  const byId = new Map<string, RoadmapNode>();
  for (const n of nodes) byId.set(norm(n.id), n);
  return byId;
}

export function buildDependentsIndex(nodes: RoadmapNode[]) {
  const deps = new Map<string, string[]>();
  for (const n of nodes) {
    const to = norm(n.id);
    for (const p of n.prereqIds || []) {
      const from = norm(p);
      if (!deps.has(from)) deps.set(from, []);
      deps.get(from)!.push(to);
    }
  }
  return deps;
}

export function prereqClosure(args: {
  targetId: string;
  byId: Map<string, RoadmapNode>;
}): Set<string> {
  const { targetId, byId } = args;
  const start = norm(targetId);

  const visited = new Set<string>();
  const stack = [start];

  while (stack.length) {
    const cur = stack.pop()!;
    if (visited.has(cur)) continue;
    visited.add(cur);

    const node = byId.get(cur);
    if (!node) continue;

    for (const p of node.prereqIds || []) {
      const pid = norm(p);
      if (!visited.has(pid)) stack.push(pid);
    }
  }

  return visited;
}

export function highlightEdgesForSet(args: {
  visibleIds: Set<string>;
  byId: Map<string, RoadmapNode>;
}): Set<string> {
  const { visibleIds, byId } = args;
  const edges = new Set<string>();

  for (const toId of visibleIds) {
    const n = byId.get(toId);
    if (!n) continue;

    for (const p of n.prereqIds || []) {
      const fromId = norm(p);
      if (!visibleIds.has(fromId)) continue;
      edges.add(`${fromId}->${toId}`);
    }
  }

  return edges;
}

export function computeFocusSet(args: {
  nodes: RoadmapNode[];
  nextId: string;
  completedIds: Set<string>;
  includeNearbyBranches?: boolean;
  canUnlock?: (node: RoadmapNode) => boolean;
}): { focusIds: Set<string>; highlightEdges: Set<string> } {
  const {
    nodes,
    nextId,
    completedIds,
    includeNearbyBranches = true,
    canUnlock,
  } = args;

  const byId = buildNodeIndex(nodes);
  const dependents = buildDependentsIndex(nodes);

  // Inclou el camí de prerequisits cap al nextId
  const core = prereqClosure({ targetId: nextId, byId });
  const focusIds = new Set<string>(core);

  // Inclou TOTS els nodes completats
  for (const completedId of completedIds) {
    focusIds.add(completedId);
  }

  if (includeNearbyBranches) {
    // Inclou dependents directes del nextId
    const nextNorm = norm(nextId);
    const deps = dependents.get(nextNorm) || [];

    for (const depId of deps) {
      const dep = byId.get(depId);
      if (!dep) continue;

      const ok = (dep.prereqIds || []).every((p) => {
        const pid = norm(p);
        return completedIds.has(pid) || core.has(pid);
      });

      if (ok) focusIds.add(depId);
    }

    // Inclou TOTS els nodes que es poden desbloquejar ara
    if (canUnlock) {
      for (const node of nodes) {
        const id = norm(node.id);
        if (!completedIds.has(id) && canUnlock(node)) {
          focusIds.add(id);
        }
      }
    }
  }

  const highlightEdges = highlightEdgesForSet({ visibleIds: focusIds, byId });
  return { focusIds, highlightEdges };
}
