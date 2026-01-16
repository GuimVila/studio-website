<template>
  <div class="map-shell">
    <div class="overlay" :class="{ mobile: isMobile }">
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

      <button
        class="chip zoom-btn"
        type="button"
        @click="setZoom(zoomLocal - 0.1)"
      >
        −
      </button>

      <div class="chip stat">
        <span class="muted">Zoom</span>
        <strong>{{ Math.round(zoomLocal * 100) }}%</strong>
      </div>

      <button
        class="chip zoom-btn"
        type="button"
        @click="setZoom(zoomLocal + 0.1)"
      >
        +
      </button>
    </div>

    <!-- FRAME (aquí hi ha el border i el clip) -->
    <div class="map-frame">
      <div ref="viewportRef" class="viewport">
        <div class="stage" :style="stageStyle">
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

const viewportSize = ref({ w: 1200, h: 800 });
let ro = null;

const isMobile = computed(() => (viewportSize.value.w || 9999) <= 768);

function setZoom(v) {
  const next = clampZoom(v);
  zoomLocal.value = next;
  emit("update:zoom", next);
}

onMounted(() => {
  if (!viewportRef.value) return;
  ro = new ResizeObserver(([entry]) => {
    const r = entry.contentRect;
    viewportSize.value = { w: r.width, h: r.height };
  });
  ro.observe(viewportRef.value);

  // Mòbil: auto-fit al primer render (sense tocar lògica)
  // IMPORTANT: ho fem quan ja hi ha mides i canvas calculat
  requestAnimationFrame(() => {
    if (isMobile.value) fitToScreen();
  });
});

onBeforeUnmount(() => {
  ro?.disconnect?.();
});

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

  // focus actiu: només focus, però mantenim search/hideLocked
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

  // mode normal
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

/**
 * ====== LAYOUT RESPONSIVE (aquí és on es guanya la UX mòbil) ======
 */
const NODE_W = computed(() => (isMobile.value ? 220 : 280));
const NODE_H = computed(() => (isMobile.value ? 108 : 120));
const NODE_GAP_X = computed(() => (isMobile.value ? 18 : 40));
const NODE_GAP_Y = computed(() => (isMobile.value ? 28 : 60));
const PADDING_X = computed(() => (isMobile.value ? 24 : 140));
const PADDING_Y = computed(() => (isMobile.value ? 120 : 220));

// Padding intern del cluster
const CLUSTER_PAD_X = computed(() => (isMobile.value ? 20 : 40));
const CLUSTER_PAD_TOP = computed(() => (isMobile.value ? 90 : 125));
const CLUSTER_PAD_BOTTOM = computed(() => (isMobile.value ? 36 : 50));
const CLUSTER_PAD_Y = computed(() => (isMobile.value ? 54 : 80));

// Separació entre clusters
const CAT_GAP_X = computed(() => (isMobile.value ? 32 : 140));
const CAT_GAP_Y = computed(() => (isMobile.value ? 48 : 160));

// nodes per fila dins categoria
const NODES_PER_ROW = computed(() => {
  if (!isMobile.value) {
    const total = visibleNodes.value.length;
    if (total <= 20) return 3;
    if (total <= 50) return 4;
    return 5;
  }

  const vw = viewportSize.value.w || 390;

  if (vw < 380) return 2;
  if (vw < 460) return 3;
  return 4;
});

// columnes de categories
const CAT_COLS = computed(() => {
  const w = viewportSize.value.w || 1200;
  if (w < 900) return 1;
  if (w < 1100) return 2;
  return 3;
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

// Layout de cada cluster
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

  // alçada màxima per fila de categories
  const rowHeights = [];
  for (let i = 0; i < meta.length; i++) {
    const row = Math.floor(i / catCols);
    rowHeights[row] = Math.max(rowHeights[row] || 0, meta[i].height);
  }

  // y acumulada per fila (aquí controles que la primera fila baixi)
  const rowY = [];
  let acc = PADDING_Y.value;
  for (let r = 0; r < rowHeights.length; r++) {
    rowY[r] = acc;
    acc += rowHeights[r] + CAT_GAP_Y.value;
  }

  // mapa final cat -> layout
  const map = new Map();
  for (let i = 0; i < meta.length; i++) {
    const row = Math.floor(i / catCols);
    const col = i % catCols;

    const x = PADDING_X.value + col * (meta[i].width + CAT_GAP_X.value);
    const y = rowY[row];

    map.set(meta[i].cat, { ...meta[i], x, y });
  }

  return map;
});

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
      x: PADDING_X.value,
      y: PADDING_Y.value,
    }
  );
}

// --- bounds/canvas
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

  minX = Math.max(0, minX - PADDING_X.value);
  minY = Math.max(0, minY - PADDING_Y.value);
  maxX = maxX + PADDING_X.value;
  maxY = maxY + PADDING_Y.value;

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

  const minZ = isMobile.value ? 0.55 : 0.2; // clau per evitar “catifa” a mòbil
  const maxZ = isMobile.value ? 1.6 : 2;

  return Math.min(maxZ, Math.max(minZ, v));
}

async function fitToScreen() {
  const viewport = viewportRef.value;
  if (!viewport) return;

  // assegura layout estable abans de calcular
  await nextTick();
  await new Promise((r) => requestAnimationFrame(() => r()));
  await new Promise((r) => requestAnimationFrame(() => r()));

  const vw = viewport.clientWidth || 1;
  const vh = viewport.clientHeight || 1;

  // marge intern perquè no quedi enganxat
  const pad = isMobile.value ? 12 : 24;
  const availW = Math.max(1, vw - pad * 2);
  const availH = Math.max(1, vh - pad * 2);

  const z = Math.min(availW / canvasW.value, availH / canvasH.value);
  const next = clampZoom(z);

  zoomLocal.value = next;
  emit("update:zoom", next);

  await nextTick();
  requestAnimationFrame(() => {
    const scaledW = canvasW.value * next;
    const scaledH = canvasH.value * next;

    viewport.scrollLeft = Math.max(0, (scaledW - vw) / 2);
    viewport.scrollTop = Math.max(0, (scaledH - vh) / 2);
  });
}

function scrollToNode(id) {
  const viewport = viewportRef.value;
  if (!viewport) return;

  const target = renderedNodes.value.find((n) => normId(n.id) === normId(id));
  if (!target) return;

  const vw = viewport.clientWidth || 1;
  const vh = viewport.clientHeight || 1;

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

  const vw = viewport.clientWidth || 1;
  const vh = viewport.clientHeight || 1;

  const z = zoomLocal.value;
  const cx = (target._x + NODE_W.value / 2) * z;
  const cy = (target._y + NODE_H.value / 2) * z;

  viewport.scrollLeft = Math.max(0, cx - vw / 2);
  viewport.scrollTop = Math.max(0, cy - vh / 2);
}

// Si canvien filtres / focus i estem a mòbil, refem fit (per mantenir context)
watch(
  () => [
    props.search,
    props.category,
    props.hideLocked,
    props.focusIds ? props.focusIds.length : 0,
    visibleNodes.value.length,
  ],
  async () => {
    if (!isMobile.value) return;
    await nextTick();
    fitToScreen();
  }
);

defineExpose({ scrollToNode, fitToScreen, centerNextNode });
</script>

<style scoped>
.map-shell {
  position: relative;
  overflow: visible;
}

.map-frame {
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden; /* aquí sí, per clipar el canvas a les cantonades */
  background: var(--background);
  box-shadow: var(--shadow-1);
}

/* overlay desktop */
.overlay {
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  right: 0.75rem;
  z-index: 50;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

/* overlay mòbil: bottom bar, usable amb el dit */
.overlay.mobile {
  position: absolute;
  top: auto;
  left: 0.75rem;
  right: 0.75rem;

  /* abans: bottom: 0rem; transform: translateY(50%); */
  bottom: calc(0.75rem + env(safe-area-inset-bottom));
  transform: none;

  z-index: 50;

  display: flex;
  flex-wrap: wrap; /* CLAU: permet 2 línies si cal */
  justify-content: center;
  gap: 0.5rem;

  padding: 0.5rem;
  border-radius: 16px;
  background: rgba(10, 10, 10, 0.55);
  border: 1px solid var(--border);
  backdrop-filter: blur(12px);
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
  transition:
    transform 0.15s ease,
    border-color 0.2s ease,
    background 0.2s ease;
  box-shadow: var(--shadow-1);
  white-space: nowrap;
}

.only-mobile {
  display: none;
}
.only-desktop {
  display: inline;
}

.overlay.mobile .chip {
  min-width: 0;
  flex: 1 1 140px; /* abans: 1 1 0 (massa agressiu) */
  text-align: center;
  padding: 0.75rem 0.5rem;
  font-size: 0.85rem;
  border-radius: 14px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.overlay.mobile .chip.zoom-btn {
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  padding: 0;
}

.overlay.mobile .chip.stat {
  flex: 0 1 120px;
  min-width: 0;
  padding: 0.75rem 0.5rem;
}

.overlay.mobile .chip.stat .muted,
.overlay.mobile .chip.stat strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Botons + i - de zoom: estil coherent amb els chips */
.chip.zoom-btn {
  /* mida i alineació */
  width: 44px;
  height: 44px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* mateixa pell que la resta */
  border-radius: 14px; /* una mica menys “pastilla” perquè és un botó quadrat */
  background: var(--header-bg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-1);
  backdrop-filter: blur(12px);

  /* tipografia */
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.02em;

  /* tacte */
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Hover coherent amb el teu .chip:hover però una mica més “apretat” */
.chip.zoom-btn:hover {
  background: var(--surface-2);
  border-color: rgba(208, 138, 63, 0.45);
  color: var(--accent);
  transform: translateY(-1px);
}

/* Active (quan prem): resposta clara però suau */
.chip.zoom-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.18);
}

/* Focus accessible (teu accent) */
.chip.zoom-btn:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(208, 138, 63, 0.18),
    var(--shadow-1);
}

/* Disabled coherent amb la resta */
.chip.zoom-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
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
  /* IMPORTANT: evita gestos estranys en alguns mòbils */
  -webkit-overflow-scrolling: touch;
  padding-bottom: 140px; /* ajustar 70–140 segons alçada real del bar */
  box-sizing: border-box;
}

.canvas {
  position: relative;
  transform-origin: 0 0;
  /* Evitem transition “all” que a mòbil fa efectes rars */
  transition: none;
  /* Prioritzem transform per consistència */
  transform: scale(var(--zoom)) translateZ(0);
  will-change: transform;
}

/* Category sections */
.cluster-bg {
  position: absolute;
  border: 2px solid rgba(208, 138, 63, 0.15);
  border-radius: 24px;
  background: rgba(208, 138, 63, 0.03);
  pointer-events: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.cluster-label {
  position: absolute;
  top: 0;
  transform: translateY(-50%);
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
  transition:
    opacity 0.2s ease,
    stroke 0.2s ease,
    stroke-width 0.2s ease;
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
  transition:
    transform 0.15s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.overlay.mobile .zoom-slider {
  flex: 1.4;
  padding: 0.6rem 0.75rem;
}

.overlay.mobile .zoom-slider input[type="range"] {
  width: 100%;
}

/* IMPORTANT: node width/height han de seguir el JS responsive */
@media (max-width: 768px) {
  .node {
    /* width: 200px;
    height: 96px; */
    padding: 0.75rem;
    border-radius: 14px;
  }

  .node-title {
    margin-top: 0.35rem;
    font-size: 0.85rem;
    line-height: 1.25;
    max-height: 2.5em;
  }

  .node-meta {
    margin-top: 0.45rem;
  }

  .pill {
    font-size: 0.6rem;
    padding: 0.18rem 0.45rem;
  }

  .cluster-label {
    left: 18px;
    font-size: 0.8rem;
    padding: 0.35rem 0.9rem;
  }
  .only-mobile {
    display: inline;
  }
  .only-desktop {
    display: none;
  }
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
</style>
