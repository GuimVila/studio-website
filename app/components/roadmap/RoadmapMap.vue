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

// --- ADAPTIVE LAYOUT ---
const NODE_W = 280;
const NODE_H = 120;
const NODE_GAP_X = 40;
const NODE_GAP_Y = 60;
const SECTION_GAP = 200;
const PADDING = 80;

// Adaptive columns based on visible nodes count
const NODES_PER_ROW = computed(() => {
  const total = visibleNodes.value.length;
  if (total <= 20) return 3; // Focus mode: compact
  if (total <= 50) return 4;
  return 5; // Full view: wider
});

// Group and sort nodes
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

function nodePos(n) {
  let currentY = PADDING;
  const cols = NODES_PER_ROW.value;

  for (const cat of categoryOrder.value) {
    const nodes = categoryGroups.value.get(cat) || [];
    const idx = nodes.findIndex((node) => node.id === n.id);

    if (idx !== -1) {
      const row = Math.floor(idx / cols);
      const col = idx % cols;

      const x = PADDING + col * (NODE_W + NODE_GAP_X);
      const y = currentY + row * (NODE_H + NODE_GAP_Y);

      // DEBUG
      if (idx < 10) {
        console.log(
          `Node ${n.id}: cat=${cat}, idx=${idx}, row=${row}, col=${col}, cols=${cols}, x=${x}, y=${y}`
        );
      }

      return { x, y };
    }

    const rows = Math.ceil(nodes.length / cols);
    currentY += rows * (NODE_H + NODE_GAP_Y) + SECTION_GAP;
  }

  return { x: PADDING, y: PADDING };
}

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
    maxX = Math.max(maxX, x + NODE_W);
    maxY = Math.max(maxY, y + NODE_H);
  }

  minX = Math.max(0, minX - PADDING);
  minY = Math.max(0, minY - PADDING);
  maxX = maxX + PADDING;
  maxY = maxY + PADDING;

  return { minX, minY, w: maxX - minX, h: maxY - minY };
});

const canvasW = computed(() => Math.max(1, Math.ceil(bounds.value.w)));
const canvasH = computed(() => Math.max(1, Math.ceil(bounds.value.h)));

const canvasStyle = computed(() => {
  console.log(`Canvas dimensions: ${canvasW.value}px x ${canvasH.value}px`);
  return {
    width: `${canvasW.value}px`,
    height: `${canvasH.value}px`,
    "--zoom": String(zoomLocal.value),
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
      catMaxX = Math.max(catMaxX, pos.x + NODE_W);
      catMinY = Math.min(catMinY, pos.y);
      catMaxY = Math.max(catMaxY, pos.y + NODE_H);
    }

    clusters.push({
      category: cat,
      x: catMinX - minX - 40,
      y: catMinY - minY - 60,
      width: catMaxX - catMinX + 80,
      height: catMaxY - catMinY + 120,
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
  top: -14px;
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
  width: 280px;
  height: 120px;
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
