<template>
  <div class="map-shell">
    <div class="overlay">
      <button class="chip" type="button" @click="fitToScreen">
        Ajustar a pantalla
      </button>
      <button
        class="chip"
        type="button"
        :disabled="!nextSeq"
        :title="
          nextSeq ? `Centrar node següent recomanat` : 'No hi ha node recomanat'
        "
        @click="centerNextNode"
      >
        Anar al següent
      </button>
      <div class="chip stat">
        <span class="muted">Zoom</span>
        <strong>{{ Math.round(zoomLocal * 100) }}%</strong>
      </div>
    </div>

    <div ref="viewportRef" class="viewport">
      <div ref="canvasRef" class="canvas" :style="canvasStyle">
        <!-- Cluster backgrounds -->
        <div
          v-for="cluster in renderedClusters"
          :key="cluster.category"
          class="cluster-bg"
          :style="{
            left: cluster.x + 'px',
            top: cluster.y + 'px',
            width: cluster.width + 'px',
            height: cluster.height + 'px',
          }"
        >
          <div class="cluster-label">{{ cluster.category }}</div>
        </div>

        <!-- Edges -->
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
            :class="{ highlighted: e.highlighted, dimmed: e.dimmed }"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <!-- Nodes -->
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

  // Si el mode focus està actiu, NOMÉS comprovar focus (ignora categoria)
  if (focusSet.value) {
    if (!focusSet.value.has(normId(n.id))) return false;

    // Aplicar cerca i hideLocked fins i tot amb focus actiu
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

    return true;
  }

  // Sense mode focus, aplicar filtres normals
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

  return true;
}

const visibleNodes = computed(() => (props.nodes || []).filter(matchesFilters));

// --- IMPROVED CLUSTERED LAYOUT ---
const NODE_W = 240;
const NODE_H = 110;
const NODE_GAP = 20;
const CLUSTER_PAD = 120;
const CLUSTER_GAP_X = 200;
const CLUSTER_GAP_Y = 180;
const NODES_PER_ROW = 8;
const CLUSTERS_PER_ROW = 2; // Distribute clusters in a 2D grid

// Group nodes by category
const categoryGroups = computed(() => {
  const groups = new Map();

  for (const n of visibleNodes.value) {
    const cat = String(n.category || "Altres");
    if (!groups.has(cat)) {
      groups.set(cat, []);
    }
    groups.get(cat).push(n);
  }

  // Sort nodes within each category by seq
  for (const [_, nodes] of groups) {
    nodes.sort((a, b) => {
      const seqA = Number.isFinite(a.seq) ? a.seq : 999999;
      const seqB = Number.isFinite(b.seq) ? b.seq : 999999;
      return seqA - seqB;
    });
  }

  return groups;
});

const categoryOrder = computed(() => {
  const cats = Array.from(categoryGroups.value.keys());
  return cats.sort((a, b) => a.localeCompare(b));
});

// Calculate cluster positions and dimensions in 2D grid
const clusterLayouts = computed(() => {
  const layouts = new Map();
  let clusterIndex = 0;
  let maxClusterHeight = 0;

  for (const cat of categoryOrder.value) {
    const nodes = categoryGroups.value.get(cat) || [];
    const nodeCount = nodes.length;
    const rows = Math.ceil(nodeCount / NODES_PER_ROW);
    const cols = Math.min(nodeCount, NODES_PER_ROW);

    const clusterW = cols * NODE_W + (cols - 1) * NODE_GAP;
    const clusterH = rows * NODE_H + (rows - 1) * NODE_GAP;

    // Calculate position in 2D grid
    const gridRow = Math.floor(clusterIndex / CLUSTERS_PER_ROW);
    const gridCol = clusterIndex % CLUSTERS_PER_ROW;

    // Dynamically calculate max width per column for proper spacing
    const maxWidthPerCol = 2200; // Approximate max width per column
    const offsetX = CLUSTER_PAD + gridCol * (maxWidthPerCol + CLUSTER_GAP_X);
    const offsetY = CLUSTER_PAD + gridRow * (1000 + CLUSTER_GAP_Y); // Approximate height

    layouts.set(cat, {
      x: offsetX,
      y: offsetY,
      width: clusterW,
      height: clusterH,
      rows,
      cols,
      gridRow,
      gridCol,
    });

    maxClusterHeight = Math.max(maxClusterHeight, clusterH);
    clusterIndex++;
  }

  return { layouts, maxClusterHeight };
});

function nodePos(n) {
  const cat = String(n.category || "Altres");
  const layout = clusterLayouts.value.layouts.get(cat);

  if (!layout) {
    return { x: 0, y: 0 };
  }

  const nodes = categoryGroups.value.get(cat) || [];
  const idx = nodes.findIndex((node) => node.id === n.id);

  if (idx === -1) {
    return { x: layout.x, y: layout.y };
  }

  const row = Math.floor(idx / NODES_PER_ROW);
  const col = idx % NODES_PER_ROW;

  const x = layout.x + col * (NODE_W + NODE_GAP);
  const y = layout.y + row * (NODE_H + NODE_GAP);

  return { x, y };
}

const bounds = computed(() => {
  if (!visibleNodes.value.length) {
    return { minX: 0, minY: 0, w: 1200, h: 800 };
  }

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const n of visibleNodes.value) {
    const { x, y } = nodePos(n);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + NODE_W);
    maxY = Math.max(maxY, y + NODE_H);
  }

  minX = Math.max(0, minX - CLUSTER_PAD);
  minY = Math.max(0, minY - CLUSTER_PAD);
  maxX = maxX + CLUSTER_PAD;
  maxY = maxY + CLUSTER_PAD;

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

// Cluster backgrounds for visual separation
const renderedClusters = computed(() => {
  const { minX, minY } = bounds.value;
  const clusters = [];

  for (const cat of categoryOrder.value) {
    const layout = clusterLayouts.value.layouts.get(cat);
    if (!layout) continue;

    clusters.push({
      category: cat,
      x: layout.x - minX - 30,
      y: layout.y - minY - 30,
      width: layout.width + 60,
      height: layout.height + 60,
    });
  }

  return clusters;
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

      // Dim edges that cross categories (unless highlighted)
      const crossCategory = from.category !== n.category;
      const dimmed = crossCategory && !highlighted;

      out.push({ key, highlighted, dimmed, d: bezierPath(x1, y1, x2, y2) });
    }
  }

  return out;
});

// --- node visuals
function nodeStyle(n) {
  return { left: `${n._x}px`, top: `${n._y}px` };
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

function centerNextNode() {
  if (!props.nextSeq) return;

  const viewport = viewportRef.value;
  if (!viewport) return;

  const target = renderedNodes.value.find((n) => n.seq === props.nextSeq);
  if (!target) return;

  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;

  const z = zoomLocal.value;
  const cx = (target._x + NODE_W / 2) * z;
  const cy = (target._y + NODE_H / 2) * z;

  viewport.scrollLeft = Math.max(0, cx - vw / 2);
  viewport.scrollTop = Math.max(0, cy - vh / 2);
}

defineExpose({ scrollToNode, fitToScreen, centerNextNode });
</script>

<style scoped>
.map-shell {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  background: var(--background);
  box-shadow: var(--shadow-1);
}

.overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 5;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.chip {
  border-radius: 50px;
  padding: 0.625rem 1rem;
  border: 1px solid var(--border);
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  color: var(--text);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-1);
}

.chip:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.chip:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.chip:disabled:hover {
  background: var(--header-bg);
  border-color: var(--border);
  color: var(--text);
}

.chip.stat {
  cursor: default;
  display: inline-flex;
  gap: 0.5rem;
  align-items: baseline;
  background: var(--surface);
}

.chip.stat:hover {
  transform: none;
  border-color: var(--border);
  color: var(--text);
}

.muted {
  opacity: 0.7;
}

.viewport {
  height: min(78vh, 780px);
  overflow: auto;
  position: relative;
  scroll-behavior: smooth;
}

.canvas {
  position: relative;
  transform-origin: 0 0;
  zoom: var(--zoom);
  transition: all 0.4s ease;
}

@supports not (zoom: 1) {
  .canvas {
    zoom: 1;
    transform: scale(var(--zoom)) translateZ(0);
    will-change: transform;
  }
}

/* Cluster backgrounds */
.cluster-bg {
  position: absolute;
  border: 2px solid var(--border);
  border-radius: 24px;
  background: var(--surface);
  pointer-events: none;
  transition: all 0.3s ease;
}

.cluster-label {
  position: absolute;
  top: -12px;
  left: 20px;
  padding: 0.35rem 1rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-1);
}

.edges {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.edge {
  fill: none;
  stroke: var(--border-strong);
  stroke-width: 2;
  opacity: 0.5;
  shape-rendering: geometricPrecision;
  transition: all 0.3s ease;
}

.edge.dimmed {
  stroke: var(--border);
  stroke-width: 1.5;
  opacity: 0.25;
  stroke-dasharray: 4 4;
}

@keyframes edgePulse {
  0% {
    stroke-opacity: 0.6;
  }
  50% {
    stroke-opacity: 1;
  }
  100% {
    stroke-opacity: 0.6;
  }
}

.edge.highlighted {
  stroke: var(--accent);
  stroke-width: 3.5;
  opacity: 1;
  animation: edgePulse 2.2s ease-in-out infinite;
}

.node {
  position: absolute;
  width: 240px;
  height: 110px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  text-align: left;
  padding: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.node:hover {
  transform: translateY(-3px);
  background: var(--surface);
  border-color: var(--accent);
  box-shadow: var(--shadow-1);
  z-index: 10;
}

.node.locked {
  opacity: 0.45;
  filter: grayscale(0.4);
  cursor: not-allowed;
}

.node.locked:hover {
  transform: none;
  background: var(--surface-2);
  border-color: var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.node.completed {
  border-color: var(--accent);
  background: var(--surface);
  box-shadow: 0 0 0 2px rgba(208, 138, 63, 0.12);
}

.node.completed::before {
  content: "✓";
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  font-weight: 900;
  font-size: 0.7rem;
}

.node.highlighted {
  border-color: var(--accent);
  border-width: 2px;
  box-shadow:
    0 0 0 4px rgba(208, 138, 63, 0.2),
    var(--shadow-2);
  animation: pulse 2s ease-in-out infinite;
  z-index: 15;
}

@keyframes pulse {
  0%,
  100% {
    transform: translateY(-3px) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.03);
  }
}

.node-id {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent);
  opacity: 0.85;
  letter-spacing: 0.03em;
}

.node-title {
  margin-top: 0.4rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  max-height: 2.5em;
  overflow: hidden;
  color: var(--text);
}

.node-meta {
  margin-top: 0.6rem;
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.pill {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  background: var(--background);
  border-radius: 999px;
  padding: 0.2rem 0.5rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .overlay {
    top: 0.75rem;
    right: 0.75rem;
    gap: 0.5rem;
  }

  .chip {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
