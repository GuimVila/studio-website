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
import {
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";

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

const viewportSize = ref({ w: 1200, h: 800 });
let ro = null;

onMounted(() => {
  if (!viewportRef.value) return;
  ro = new ResizeObserver(([entry]) => {
    const r = entry.contentRect;
    viewportSize.value = { w: r.width, h: r.height };
  });
  ro.observe(viewportRef.value);
});

onBeforeUnmount(() => {
  ro?.disconnect?.();
});

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------
function isMobileViewport() {
  const w = viewportRef.value?.clientWidth || window.innerWidth || 0;
  return w <= 768;
}

function normId(id) {
  return String(id || "")
    .trim()
    .toUpperCase();
}

// ----------------------------------------------------
// Zoom local (sync with parent)
// ----------------------------------------------------
const zoomLocal = ref(Number.isFinite(props.zoom) ? props.zoom : 1);
watch(
  () => props.zoom,
  (v) => {
    if (Number.isFinite(v)) zoomLocal.value = v;
  }
);

// ----------------------------------------------------
// Responsive layout metrics (JS-driven)
// ----------------------------------------------------
const isMobile = computed(() => {
  const w = viewportSize.value?.w || viewportRef.value?.clientWidth || 1200;
  return w < 768;
});

const NODE_W = computed(() => (isMobile.value ? 220 : 280));
const NODE_H = computed(() => (isMobile.value ? 108 : 120));
const NODE_GAP_X = computed(() => (isMobile.value ? 20 : 40));
const NODE_GAP_Y = computed(() => (isMobile.value ? 40 : 60));

const PADDING = computed(() => (isMobile.value ? 70 : 140));

// Padding intern del cluster
const CLUSTER_PAD_X = computed(() => (isMobile.value ? 26 : 40));
const CLUSTER_PAD_TOP = computed(() => (isMobile.value ? 78 : 92));
const CLUSTER_PAD_BOTTOM = computed(() => (isMobile.value ? 40 : 50));
const CLUSTER_PAD_Y = computed(() => (isMobile.value ? 64 : 80));

// Separació entre clusters
const CAT_GAP_X = computed(() => (isMobile.value ? 70 : 140));
const CAT_GAP_Y = computed(() => (isMobile.value ? 110 : 160));

// Quants nodes per fila dins categoria
const NODES_PER_ROW = computed(() => {
  if (isMobile.value) {
    const w = viewportSize.value?.w || 390;
    if (w < 380) return 3;
    if (w < 430) return 4;
    if (w < 500) return 5;
    return 6;
  }

  const total = visibleNodes.value.length;
  if (total <= 20) return 3;
  if (total <= 50) return 4;
  return 5;
});
// Quantes columnes de categories
const CAT_COLS = computed(() => {
  const w = viewportSize.value?.w || viewportRef.value?.clientWidth || 1200;
  if (w < 900) return 1;
  if (w < 1100) return 2;
  return 3;
});

// ----------------------------------------------------
// Filters
// ----------------------------------------------------
const focusSet = computed(() => {
  if (!props.focusIds) return null;
  const s = new Set();
  for (const id of props.focusIds) s.add(normId(id));
  return s;
});

function matchesFilters(n) {
  if (!n) return false;

  // Focus mode: només focus, però aplica search + hideLocked
  if (focusSet.value) {
    if (!focusSet.value.has(normId(n.id))) return false;

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

  // Filtres normals
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

// ----------------------------------------------------
// Group and sort nodes
// ----------------------------------------------------
const sortedNodes = computed(() => {
  return [...visibleNodes.value].sort((a, b) => {
    const seqA = Number.isFinite(a.seq) ? a.seq : 999999;
    const seqB = Number.isFinite(b.seq) ? b.seq : 999999;
    return seqA - seqB;
  });
});

const categoryGroups = computed(() => {
  const groups = new Map();
  for (const n of sortedNodes.value) {
    const cat = String(n.category || "Altres");
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(n);
  }
  return groups;
});

const categoryOrder = computed(() => {
  return Array.from(categoryGroups.value.keys()).sort((a, b) => {
    const minSeqA = Math.min(
      ...(categoryGroups.value.get(a) || []).map((n) => n.seq || 999999)
    );
    const minSeqB = Math.min(
      ...(categoryGroups.value.get(b) || []).map((n) => n.seq || 999999)
    );
    return minSeqA - minSeqB;
  });
});

// ----------------------------------------------------
// Layout clusters
// ----------------------------------------------------
const clusterLayout = computed(() => {
  const colsInside = NODES_PER_ROW.value;
  const catCols = CAT_COLS.value;

  const cats = categoryOrder.value;
  const meta = cats.map((cat) => {
    const nodes = categoryGroups.value.get(cat) || [];
    const rows = Math.max(1, Math.ceil(nodes.length / colsInside));

    const innerW =
      colsInside * NODE_W.value + (colsInside - 1) * NODE_GAP_X.value;
    const innerH = rows * NODE_H.value + (rows - 1) * NODE_GAP_Y.value;

    const width = innerW + CLUSTER_PAD_X.value * 2;
    const height = innerH + CLUSTER_PAD_Y.value * 2;

    return { cat, nodes, rows, innerW, innerH, width, height };
  });

  // alçada per fila de categories
  const rowHeights = [];
  for (let i = 0; i < meta.length; i++) {
    const row = Math.floor(i / catCols);
    rowHeights[row] = Math.max(rowHeights[row] || 0, meta[i].height);
  }

  const rowY = [];
  let acc = PADDING.value;
  for (let r = 0; r < rowHeights.length; r++) {
    rowY[r] = acc;
    acc += rowHeights[r] + CAT_GAP_Y.value;
  }

  const map = new Map();
  for (let i = 0; i < meta.length; i++) {
    const row = Math.floor(i / catCols);
    const col = i % catCols;

    const x = PADDING.value + col * (meta[i].width + CAT_GAP_X.value);
    const y = rowY[row];

    map.set(meta[i].cat, { ...meta[i], x, y });
  }

  return map;
});

// ----------------------------------------------------
// Positions by id
// ----------------------------------------------------
const positionsById = computed(() => {
  const pos = new Map();
  const colsInside = NODES_PER_ROW.value;

  for (const cat of categoryOrder.value) {
    const layout = clusterLayout.value.get(cat);
    if (!layout) continue;

    const nodes = layout.nodes || [];
    for (let idx = 0; idx < nodes.length; idx++) {
      const n = nodes[idx];
      const row = Math.floor(idx / colsInside);
      const col = idx % colsInside;

      const x =
        layout.x +
        CLUSTER_PAD_X.value +
        col * (NODE_W.value + NODE_GAP_X.value);
      const y =
        layout.y +
        CLUSTER_PAD_Y.value +
        row * (NODE_H.value + NODE_GAP_Y.value);

      pos.set(normId(n.id), { x, y });
    }
  }

  return pos;
});

function nodePos(n) {
  return (
    positionsById.value.get(normId(n.id)) || {
      x: PADDING.value,
      y: PADDING.value,
    }
  );
}

// ----------------------------------------------------
// Bounds + canvas
// ----------------------------------------------------
const bounds = computed(() => {
  if (!visibleNodes.value.length) {
    return { minX: 0, minY: 0, w: 1400, h: 800 };
  }

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const n of visibleNodes.value) {
    const { x, y } = nodePos(n);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + NODE_W.value);
    maxY = Math.max(maxY, y + NODE_H.value);
  }

  minX = Math.max(0, minX - PADDING.value);
  minY = Math.max(0, minY - PADDING.value);
  maxX = maxX + PADDING.value;
  maxY = maxY + PADDING.value;

  return { minX, minY, w: maxX - minX, h: maxY - minY };
});

const canvasW = computed(() => Math.max(1, Math.ceil(bounds.value.w)));
const canvasH = computed(() => Math.max(1, Math.ceil(bounds.value.h)));

const canvasStyle = computed(() => {
  return {
    width: `${canvasW.value}px`,
    height: `${canvasH.value}px`,
    "--zoom": String(zoomLocal.value),
    "--node-w": `${NODE_W.value}px`,
    "--node-h": `${NODE_H.value}px`,
  };
});

const renderedNodes = computed(() => {
  const { minX, minY } = bounds.value;
  return visibleNodes.value.map((n) => {
    const p = nodePos(n);
    return { ...n, _x: p.x - minX, _y: p.y - minY };
  });
});

const renderedClusters = computed(() => {
  const { minX, minY } = bounds.value;
  const clusters = [];

  for (const cat of categoryOrder.value) {
    const nodes = categoryGroups.value.get(cat) || [];
    if (!nodes.length) continue;

    let catMinX = Infinity,
      catMaxX = -Infinity;
    let catMinY = Infinity,
      catMaxY = -Infinity;

    for (const node of nodes) {
      const pos = nodePos(node);
      catMinX = Math.min(catMinX, pos.x);
      catMaxX = Math.max(catMaxX, pos.x + NODE_W.value);
      catMinY = Math.min(catMinY, pos.y);
      catMaxY = Math.max(catMaxY, pos.y + NODE_H.value);
    }

    const x = catMinX - minX - CLUSTER_PAD_X.value;
    const y = catMinY - minY - CLUSTER_PAD_TOP.value;

    clusters.push({
      category: cat,
      x,
      y,
      width: catMaxX - catMinX + CLUSTER_PAD_X.value * 2,
      height:
        catMaxY - catMinY + CLUSTER_PAD_TOP.value + CLUSTER_PAD_BOTTOM.value,
    });
  }

  return clusters;
});

// ----------------------------------------------------
// Edges
// ----------------------------------------------------
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
  const dx = Math.abs(x2 - x1);
  const controlOffset = Math.min(dx * 0.5, 200);

  const c1x = x1 + controlOffset;
  const c1y = y1;
  const c2x = x2 - controlOffset;
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

      const x1 = from._x + NODE_W.value;
      const y1 = from._y + NODE_H.value * 0.5;
      const x2 = n._x;
      const y2 = n._y + NODE_H.value * 0.5;

      const key = edgeKey(fromId, toId);
      const highlighted = highlightEdgeSet.value
        ? highlightEdgeSet.value.has(key)
        : false;

      const crossCategory = from.category !== n.category;
      const dimmed = crossCategory && !highlighted;

      out.push({ key, highlighted, dimmed, d: bezierPath(x1, y1, x2, y2) });
    }
  }

  return out;
});

// ----------------------------------------------------
// Node visuals
// ----------------------------------------------------
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

// ----------------------------------------------------
// UX helpers
// ----------------------------------------------------
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
  const cx = (target._x + NODE_W.value / 2) * z;
  const cy = (target._y + NODE_H.value / 2) * z;

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
  const cx = (target._x + NODE_W.value / 2) * z;
  const cy = (target._y + NODE_H.value / 2) * z;

  viewport.scrollLeft = Math.max(0, cx - vw / 2);
  viewport.scrollTop = Math.max(0, cy - vh / 2);
}

defineExpose({ scrollToNode, fitToScreen, centerNextNode });

// ----------------------------------------------------
// Auto-fit on mobile at entry + on filter changes (mobile only)
// ----------------------------------------------------
onMounted(async () => {
  await nextTick();
  if (isMobileViewport()) fitToScreen();
});

watch(
  () => [props.search, props.category, props.hideLocked, props.focusIds],
  async () => {
    await nextTick();
    if (isMobileViewport()) fitToScreen();
  }
);
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

/* Category sections */
.cluster-bg {
  position: absolute;
  border: 2px solid rgba(208, 138, 63, 0.15);
  border-radius: 24px;
  background: rgba(208, 138, 63, 0.03);
  pointer-events: none;
  transition: all 0.3s ease;
}

.cluster-label {
  position: absolute;
  top: -6px;
  left: 30px;
  padding: 0.4rem 1.2rem;
  background: var(--accent);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  box-shadow: 0 3px 8px rgba(208, 138, 63, 0.25);
}

.edges {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.edge {
  fill: none;
  stroke: rgba(208, 138, 63, 0.3);
  stroke-width: 2.5;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.edge.dimmed {
  stroke: var(--border);
  stroke-width: 2;
  opacity: 0.25;
  stroke-dasharray: 4 4;
}

.edge.highlighted {
  stroke: var(--accent);
  stroke-width: 3.5;
  opacity: 1;
}

.node {
  position: absolute;
  width: var(--node-w);
  height: var(--node-h);
  border-radius: 16px;
  border: 2px solid var(--border);
  background: var(--surface);
  color: var(--text);
  text-align: left;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.node:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 6px 16px rgba(208, 138, 63, 0.2);
  z-index: 10;
}

.node.locked {
  opacity: 0.5;
  filter: grayscale(0.5);
  cursor: not-allowed;
}

.node.locked:hover {
  transform: none;
  border-color: var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.node.completed {
  border-color: var(--accent);
  background: rgba(208, 138, 63, 0.05);
  box-shadow: 0 0 0 2px rgba(208, 138, 63, 0.15);
}

.node.completed::after {
  content: "✓";
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  font-weight: 900;
  font-size: 0.8rem;
}

.node.highlighted {
  border-color: var(--accent);
  border-width: 3px;
  box-shadow: 0 0 0 4px rgba(208, 138, 63, 0.2);
  z-index: 15;
}

.node-id {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent);
  opacity: 0.85;
  letter-spacing: 0.03em;
}

.node-title {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
  max-height: 2.6em;
  overflow: hidden;
  color: var(--text);
}

.node-meta {
  margin-top: 0.65rem;
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
  padding: 0.2rem 0.55rem;
  opacity: 0.8;
}

/* -----------------------
   MOBILE FIXES
   ----------------------- */
@media (max-width: 768px) {
  /* Bottom bar overlay */
  .overlay {
    top: auto;
    right: auto;
    left: 0.75rem;
    bottom: 0.75rem;
    width: calc(100% - 1.5rem);
    justify-content: space-between;
    gap: 0.5rem;
    z-index: 20;
  }

  .chip {
    flex: 1;
    text-align: center;
    padding: 0.7rem 0.75rem;
    font-size: 0.78rem;
  }

  /* Amaga el xip del zoom a mòbil */
  .chip.stat {
    display: none;
  }

  /* Evita sensació "gomosa" en fit/zoom */
  .canvas {
    transition: none;
  }

  .viewport {
    scroll-behavior: auto;
    height: min(70vh, 640px);
  }

  .node {
    padding: 0.85rem;
    border-radius: 14px;
  }

  .node-title {
    font-size: 0.85rem;
  }
}
</style>
