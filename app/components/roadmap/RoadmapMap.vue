<template>
  <div class="map-shell">
    <div class="overlay">
      <button class="chip" type="button" @click="fitToScreen">Fit</button>
      <button
        class="chip"
        type="button"
        :disabled="!highlightId"
        @click="scrollToNode(highlightId)"
      >
        Center
      </button>
      <div class="chip stat">
        <span class="muted">Zoom</span>
        <strong>{{ Math.round(zoomLocal * 100) }}%</strong>
      </div>
    </div>

    <div ref="viewportRef" class="viewport">
      <div ref="canvasRef" class="canvas" :style="canvasStyle">
        <svg
          class="edges"
          :width="canvasW"
          :height="canvasH"
          :viewBox="`0 0 ${canvasW} ${canvasH}`"
          preserveAspectRatio="xMinYMin meet"
          aria-hidden="true"
        >
          <path
            v-for="e in renderedEdges"
            :key="e.key"
            :d="e.d"
            class="edge"
            :class="{ highlighted: e.highlighted }"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <button
          v-for="n in renderedNodes"
          :key="n.id"
          class="node"
          type="button"
          :class="nodeClass(n)"
          :style="nodeStyle(n)"
          @click="$emit('select', n.id)"
        >
          <div class="node-id">{{ n.id }}</div>
          <div class="node-title">{{ n.title }}</div>
          <div class="node-meta">
            <span class="pill">{{ n.category }}</span>
            <span v-if="n.module" class="pill">{{ n.module }}</span>
            <span v-if="Number.isFinite(n.level)" class="pill"
              >L{{ n.level }}</span
            >
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  nodes: { type: Array, required: true },

  zoom: { type: Number, default: 1 },

  search: { type: String, default: "" },
  category: { type: String, default: "" },
  hideLocked: { type: Boolean, default: false },

  focusIds: { type: Array, default: null }, // string[] | null
  highlightEdges: { type: Array, default: null }, // [from,to][] | null

  highlightId: { type: [String, null], default: null },
  nextSeq: { type: [Number, null], default: null },

  isCompleted: { type: Function, required: true },
  canUnlock: { type: Function, required: true },
});

const emit = defineEmits(["select", "update:zoom"]);

const viewportRef = ref(null);
const canvasRef = ref(null);

// zoom local (sync with parent)
const zoomLocal = ref(Number.isFinite(props.zoom) ? props.zoom : 1);
watch(
  () => props.zoom,
  (v) => {
    if (Number.isFinite(v)) zoomLocal.value = v;
  }
);

function normId(id) {
  return String(id || "")
    .trim()
    .toUpperCase();
}

const focusSet = computed(() => {
  if (!props.focusIds) return null;
  const s = new Set();
  for (const id of props.focusIds) s.add(normId(id));
  return s;
});

function matchesFilters(n) {
  if (!n) return false;

  if (props.category && String(n.category) !== String(props.category))
    return false;

  const q = String(props.search || "")
    .trim()
    .toLowerCase();
  if (q) {
    const hay = [n.id, n.title, n.module, n.category, n.tags]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }

  if (props.hideLocked) {
    const ok = props.canUnlock(n) || props.isCompleted(n.id);
    if (!ok) return false;
  }

  if (focusSet.value && !focusSet.value.has(normId(n.id))) return false;

  return true;
}

const visibleNodes = computed(() => (props.nodes || []).filter(matchesFilters));

// --- layout (simple, deterministic)
const NODE_W = 260;
const NODE_H = 120;
const GAP_X = 140;
const GAP_Y = 200;
const PAD = 140;

const laneOrder = computed(() => {
  const set = new Set((props.nodes || []).map((n) => String(n.category || "")));
  return Array.from(set)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
});

function laneIndex(category) {
  const i = laneOrder.value.indexOf(String(category || ""));
  return i >= 0 ? i : 0;
}

function nodePos(n) {
  const seq = Number.isFinite(n.seq) ? Number(n.seq) : 999999;
  const lvl = Number.isFinite(n.level) ? Number(n.level) : 1;

  const x = PAD + (seq - 1) * (NODE_W + GAP_X);
  const y = PAD + laneIndex(n.category) * GAP_Y + (Math.max(1, lvl) - 1) * 36;

  return { x, y };
}

const bounds = computed(() => {
  const nodes = visibleNodes.value;
  if (!nodes.length) return { minX: 0, minY: 0, w: 1200, h: 800 };

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const n of nodes) {
    const { x, y } = nodePos(n);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + NODE_W);
    maxY = Math.max(maxY, y + NODE_H);
  }

  minX = Math.max(0, minX - PAD);
  minY = Math.max(0, minY - PAD);
  maxX = maxX + PAD;
  maxY = maxY + PAD;

  return { minX, minY, w: maxX - minX, h: maxY - minY };
});

const canvasW = computed(() => Math.max(1, Math.ceil(bounds.value.w)));
const canvasH = computed(() => Math.max(1, Math.ceil(bounds.value.h)));

const canvasStyle = computed(() => ({
  width: `${canvasW.value}px`,
  height: `${canvasH.value}px`,
  "--zoom": String(zoomLocal.value),
}));

const renderedNodes = computed(() => {
  const { minX, minY } = bounds.value;
  return visibleNodes.value.map((n) => {
    const p = nodePos(n);
    return { ...n, _x: p.x - minX, _y: p.y - minY };
  });
});

// --- edges
function edgeKey(a, b) {
  return `${normId(a)}->${normId(b)}`;
}

const highlightEdgeSet = computed(() => {
  if (!props.highlightEdges) return null;
  const s = new Set();
  for (const pair of props.highlightEdges) {
    if (!pair || pair.length < 2) continue;
    s.add(edgeKey(pair[0], pair[1]));
  }
  return s;
});

function bezierPath(x1, y1, x2, y2) {
  const dx = Math.max(60, Math.min(480, Math.abs(x2 - x1) * 0.6));
  const c1x = x1 + dx;
  const c1y = y1;
  const c2x = x2 - dx;
  const c2y = y2;
  return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
}

const renderedEdges = computed(() => {
  const index = new Map(renderedNodes.value.map((n) => [normId(n.id), n]));
  const out = [];

  for (const n of renderedNodes.value) {
    const toId = normId(n.id);
    const prereqs = Array.isArray(n.prereqIds) ? n.prereqIds : [];

    for (const rawP of prereqs) {
      const fromId = normId(rawP);
      const from = index.get(fromId);
      if (!from) continue;

      const x1 = from._x + NODE_W;
      const y1 = from._y + NODE_H * 0.5;
      const x2 = n._x;
      const y2 = n._y + NODE_H * 0.5;

      const key = edgeKey(fromId, toId);
      const highlighted = highlightEdgeSet.value
        ? highlightEdgeSet.value.has(key)
        : false;

      out.push({ key, highlighted, d: bezierPath(x1, y1, x2, y2) });
    }
  }

  return out;
});

// --- node visuals
function nodeStyle(n) {
  let opacity = 1;
  if (
    props.nextSeq != null &&
    Number.isFinite(props.nextSeq) &&
    Number.isFinite(n.seq)
  ) {
    const d = Math.abs(Number(n.seq) - Number(props.nextSeq));
    if (d > 70) opacity = 0.2;
    else if (d > 45) opacity = 0.35;
    else if (d > 25) opacity = 0.55;
  }

  return { left: `${n._x}px`, top: `${n._y}px`, opacity: String(opacity) };
}

function nodeClass(n) {
  const completed = props.isCompleted(n.id);
  const unlockable = props.canUnlock(n);
  const locked = !completed && !unlockable;
  const highlighted =
    props.highlightId && normId(n.id) === normId(props.highlightId);
  return { completed, locked, highlighted };
}

// --- UX
function clampZoom(z) {
  const v = Number(z);
  if (!Number.isFinite(v)) return 1;
  return Math.min(2, Math.max(0.2, v));
}

function fitToScreen() {
  const viewport = viewportRef.value;
  if (!viewport) return;

  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;

  const z = Math.min(vw / canvasW.value, vh / canvasH.value) * 0.92;
  const next = clampZoom(z);

  zoomLocal.value = next;
  emit("update:zoom", next);

  requestAnimationFrame(() => {
    viewport.scrollLeft = Math.max(0, (canvasW.value * next - vw) / 2);
    viewport.scrollTop = Math.max(0, (canvasH.value * next - vh) / 2);
  });
}

function scrollToNode(id) {
  const viewport = viewportRef.value;
  if (!viewport) return;

  const target = renderedNodes.value.find((n) => normId(n.id) === normId(id));
  if (!target) return;

  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;

  const z = zoomLocal.value;
  const cx = (target._x + NODE_W / 2) * z;
  const cy = (target._y + NODE_H / 2) * z;

  viewport.scrollLeft = Math.max(0, cx - vw / 2);
  viewport.scrollTop = Math.max(0, cy - vh / 2);
}

defineExpose({ scrollToNode, fitToScreen });
</script>

<style scoped>
.map-shell {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}

.overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  display: flex;
  gap: 8px;
  align-items: center;
}

.chip {
  border-radius: 999px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.35);
  color: white;
  cursor: pointer;
  font-size: 12px;
}
.chip:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.chip.stat {
  cursor: default;
  display: inline-flex;
  gap: 8px;
  align-items: baseline;
}
.muted {
  opacity: 0.8;
}

.viewport {
  height: min(78vh, 780px);
  overflow: auto;
  position: relative;
}

.canvas {
  position: relative;
  transform-origin: 0 0;
  zoom: var(--zoom);
}

@supports not (zoom: 1) {
  .canvas {
    zoom: 1;
    transform: scale(var(--zoom)) translateZ(0);
    will-change: transform;
  }
}

.edges {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.edge {
  fill: none;
  stroke: rgba(255, 255, 255, 0.18);
  stroke-width: 2.5;
  opacity: 0.9;
  shape-rendering: geometricPrecision;
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

.node {
  position: absolute;
  width: 260px;
  height: 120px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  text-align: left;
  padding: 12px;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
  backdrop-filter: blur(10px);
}
.node:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.09);
}
.node.locked {
  opacity: 0.55;
}
.node.completed {
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.08);
}
.node.highlighted {
  border-color: rgba(255, 255, 255, 0.45);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.node-id {
  font-size: 12px;
  opacity: 0.85;
}
.node-title {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.25;
  max-height: 2.6em;
  overflow: hidden;
}
.node-meta {
  margin-top: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.pill {
  font-size: 11px;
  opacity: 0.82;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  padding: 4px 8px;
}
</style>
