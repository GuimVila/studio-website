<template>
  <div class="mapWrap">
    <div ref="scroller" class="scroller">
      <div
        class="stage"
        :style="{
          width: stageW + 'px',
          height: stageH + 'px',
          transform: 'scale(' + zoom + ')',
        }"
      >
        <!-- Edges -->
        <svg class="edges" :width="stageW" :height="stageH">
          <line
            v-for="(e, i) in edges"
            :key="i"
            :x1="posById.get(e.from)?.x || 0"
            :y1="posById.get(e.from)?.y || 0"
            :x2="posById.get(e.to)?.x || 0"
            :y2="posById.get(e.to)?.y || 0"
            class="edge"
            :class="{ highlighted: isEdgeHighlighted(e.from, e.to) }"
            :style="{ opacity: edgeOpacity(e.from, e.to) }"
          />
        </svg>

        <!-- Nodes -->
        <button
          v-for="n in filteredNodes"
          :key="n.id"
          class="node"
          type="button"
          :class="nodeClasses(n)"
          :style="nodeStyle(n)"
          @click="emit('select', n.id)"
        >
          <div class="nodeTop">
            <span class="nodeId">{{ n.id }}</span>
            <span v-if="isCompleted(n.id)" class="check">✓</span>
          </div>
          <div class="nodeTitle">{{ n.title }}</div>
          <div class="nodeMeta">
            <span class="pill">{{ n.category }}</span>
            <span class="pill">Lv {{ n.level }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";

const props = defineProps({
  nodes: { type: Array, required: true },
  zoom: { type: Number, default: 1 },

  search: { type: String, default: "" },
  category: { type: String, default: "" },
  hideLocked: { type: Boolean, default: false },

  // Focus pack
  focusIds: { type: [Array, Object], default: null }, // Array<string> | Set<string> | null
  highlightEdges: { type: [Array, Object], default: null }, // Array<[from,to]> | Set<string> | null
  highlightId: { type: String, default: null }, // nextId
  nextSeq: { type: Number, default: null }, // for zone fade

  // Progress functions
  isCompleted: { type: Function, required: true },
  canUnlock: { type: Function, required: true },
});

const emit = defineEmits(["select"]);

function norm(id) {
  return String(id).trim().toUpperCase();
}

/** Convert focusIds prop to a Set<string> (normalized) */
const focusSet = computed(() => {
  const f = props.focusIds;
  if (!f) return null;

  // Already a Set?
  if (typeof f?.has === "function") {
    const s = new Set();
    for (const x of f) s.add(norm(x));
    return s;
  }

  // Array
  if (Array.isArray(f)) {
    const s = new Set();
    for (const x of f) s.add(norm(x));
    return s;
  }

  return null;
});

/** Normalize highlightEdges into Set<string> key "FROM->TO" */
const highlightSet = computed(() => {
  const h = props.highlightEdges;
  if (!h) return null;

  // Set already?
  if (typeof h?.has === "function") {
    const s = new Set();
    for (const key of h) s.add(String(key));
    return s;
  }

  // Array of pairs
  if (Array.isArray(h)) {
    const s = new Set();
    for (const pair of h) {
      if (!pair || pair.length < 2) continue;
      const from = norm(pair[0]);
      const to = norm(pair[1]);
      s.add(`${from}->${to}`);
    }
    return s;
  }

  return null;
});

function isEdgeHighlighted(from, to) {
  const s = highlightSet.value;
  if (!s) return false;
  return s.has(`${norm(from)}->${norm(to)}`);
}

function matchesSearch(n, q) {
  if (!q) return true;
  const hay = [
    n.id,
    n.title,
    n.module,
    n.category,
    n.tags,
    String(n.level ?? ""),
    String(n.seq ?? ""),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase().trim());
}

const filteredNodes = computed(() => {
  const q = props.search?.trim() || "";
  const cat = props.category?.trim() || "";

  return (props.nodes || []).filter((n) => {
    if (cat && n.category !== cat) return false;
    if (!matchesSearch(n, q)) return false;

    // Focus mode: keep only focus set if provided
    if (focusSet.value && !focusSet.value.has(norm(n.id))) return false;

    // Hide locked
    if (props.hideLocked && !props.canUnlock(n) && !props.isCompleted(n.id)) {
      return false;
    }

    return true;
  });
});

/** Build edges from prereqIds among *all nodes* (not only filtered), so layout stays stable. */
const edges = computed(() => {
  const list = [];
  const byId = new Map((props.nodes || []).map((n) => [norm(n.id), n]));
  for (const n of props.nodes || []) {
    for (const p of n.prereqIds || []) {
      if (!byId.has(norm(p))) continue;
      list.push({ from: norm(p), to: norm(n.id) });
    }
  }
  return list;
});

/** Simple deterministic layout: place nodes along seq (x) and category (y lanes). */
const categories = computed(() =>
  Array.from(new Set((props.nodes || []).map((n) => n.category))).sort()
);

const laneByCategory = computed(() => {
  const m = new Map();
  categories.value.forEach((c, i) => m.set(c, i));
  return m;
});

const seqRange = computed(() => {
  let min = Infinity;
  let max = -Infinity;
  for (const n of props.nodes || []) {
    const s = Number.isFinite(n.seq) ? n.seq : 0;
    min = Math.min(min, s);
    max = Math.max(max, s);
  }
  if (!Number.isFinite(min)) min = 0;
  if (!Number.isFinite(max)) max = 0;
  return { min, max };
});

const stageW = computed(() => {
  const { min, max } = seqRange.value;
  const span = Math.max(1, max - min);
  return 420 + span * 10; // tune spacing
});

const stageH = computed(() => {
  const lanes = Math.max(1, categories.value.length);
  return 220 + lanes * 220;
});

function nodePos(n) {
  const { min } = seqRange.value;
  const seq = Number.isFinite(n.seq) ? n.seq : min;
  const lane = laneByCategory.value.get(n.category) ?? 0;

  const x = 140 + (seq - min) * 10; // x spacing per seq
  const y = 120 + lane * 220; // lane height
  return { x, y };
}

/** Map id -> position for edges */
const posById = computed(() => {
  const m = new Map();
  for (const n of props.nodes || []) {
    const p = nodePos(n);
    m.set(norm(n.id), p);
  }
  return m;
});

function nodeOpacity(n) {
  // Focus mode: nodes outside focus should not exist (filtered out),
  // but keep gentle fading based on nextSeq if provided.
  let opacity = 1;

  // Zone fade based on distance in seq from nextSeq
  if (props.nextSeq != null && Number.isFinite(props.nextSeq)) {
    const d = Math.abs((Number(n.seq) || 0) - props.nextSeq);
    if (d > 70) opacity *= 0.2;
    else if (d > 45) opacity *= 0.35;
    else if (d > 25) opacity *= 0.55;
    else opacity *= 1;
  }

  return opacity;
}

function nodeStyle(n) {
  const { x, y } = nodePos(n);
  return {
    left: `${x}px`,
    top: `${y}px`,
    opacity: String(nodeOpacity(n)),
  };
}

function nodeClasses(n) {
  const completed = props.isCompleted(n.id);
  const unlockable = props.canUnlock(n);
  const highlighted = props.highlightId && norm(props.highlightId) === norm(n.id);

  return {
    completed,
    locked: !unlockable && !completed,
    unlockable,
    highlighted,
  };
}

/** Edge opacity can also follow focus/zone fade */
function edgeOpacity(from, to) {
  // If focus mode active: only show edges where both endpoints are in focus
  if (focusSet.value) {
    if (!focusSet.value.has(norm(from)) || !focusSet.value.has(norm(to))) return 0;
  }

  // Zone fade: approximate using 'to' node seq distance
  if (props.nextSeq != null && Number.isFinite(props.nextSeq)) {
    const toNode = (props.nodes || []).find((n) => norm(n.id) === norm(to));
    const seq = Number.isFinite(toNode?.seq) ? toNode.seq : 0;
    const d = Math.abs(seq - props.nextSeq);
    if (d > 70) return 0.15;
    if (d > 45) return 0.25;
    if (d > 25) return 0.45;
  }

  return 0.55;
}

/** Expose scrollToNode to parent */
const scroller = ref(null);

/** @param {string} id */
function scrollToNode(id) {
  const el = scroller.value;
  if (!el) return;

  const p = posById.value.get(norm(id));
  if (!p) return;

  // Center node in viewport (taking zoom into account)
  const targetLeft = p.x * props.zoom - el.clientWidth / 2;
  const targetTop = p.y * props.zoom - el.clientHeight / 2;

  el.scrollTo({
    left: Math.max(0, targetLeft),
    top: Math.max(0, targetTop),
    behavior: "smooth",
  });
}

defineExpose({ scrollToNode });

watch(
  () => props.highlightId,
  async (id) => {
    if (!id) return;
    await nextTick();
    scrollToNode(id);
  }
);
</script>

<style scoped>
.mapWrap {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
}
.scroller {
  height: min(72vh, 820px);
  overflow: auto;
  position: relative;
}
.stage {
  position: relative;
  transform-origin: top left;
}

/* Edges layer */
.edges {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.edge {
  stroke: rgba(255, 255, 255, 0.22);
  stroke-width: 2.5;
}
@keyframes edgePulse {
  0% {
    stroke-opacity: 0.55;
  }
  50% {
    stroke-opacity: 1;
  }
  100% {
    stroke-opacity: 0.55;
  }
}
.edge.highlighted {
  stroke: rgba(255, 255, 255, 0.55);
  stroke-width: 4;
  opacity: 1;
  animation: edgePulse 2.2s ease-in-out infinite;
}

/* Nodes */
.node {
  position: absolute;
  width: 240px;
  min-height: 96px;
  text-align: left;
  padding: 12px 12px 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(11, 18, 32, 0.92);
  color: white;
  cursor: pointer;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.35);
  transition: transform 0.12s ease, border-color 0.12s ease,
    background 0.12s ease;
}
.node:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.22);
}
.node.completed {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(11, 18, 32, 0.86);
}
.node.locked {
  opacity: 0.7;
  filter: saturate(0.85);
}
.node.highlighted {
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 18px 64px rgba(0, 0, 0, 0.48);
}

.nodeTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.nodeId {
  font-size: 12px;
  opacity: 0.9;
}
.check {
  font-size: 14px;
}
.nodeTitle {
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.35;
  opacity: 0.95;
}
.nodeMeta {
  margin-top: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.pill {
  font-size: 12px;
  opacity: 0.9;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
