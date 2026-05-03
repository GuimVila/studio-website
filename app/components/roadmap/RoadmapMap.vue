<template>
  <div class="quest-shell">
    <div class="quest-intro">
      <div>
        <p class="quest-kicker">{{ t("readingProgress.roadmap.quest.kicker") }}</p>
        <h2>
          {{
            category
              ? categoryLabel(category)
              : t("readingProgress.roadmap.quest.title")
          }}
        </h2>
        <p>
          {{
            category
              ? t("readingProgress.roadmap.atlas.categoryIntro")
              : t("readingProgress.roadmap.quest.intro")
          }}
        </p>
      </div>

      <div class="legend" aria-label="Roadmap legend">
        <span><i class="dot available" />{{ t("readingProgress.roadmap.quest.available") }}</span>
        <span><i class="dot done" />{{ t("readingProgress.roadmap.quest.completed") }}</span>
        <span><i class="dot locked" />{{ t("readingProgress.roadmap.quest.locked") }}</span>
      </div>
    </div>

    <section class="quest-stage" aria-live="polite">
      <div v-if="positionedModules.length" class="map-toolbar">
        <button
          type="button"
          :title="t('readingProgress.roadmap.map.zoomOut')"
          :aria-label="t('readingProgress.roadmap.map.zoomOut')"
          @click="zoomOut"
        >
          <UIcon name="i-lucide-minus" aria-hidden="true" />
        </button>
        <span>{{ zoomPercent }}%</span>
        <button
          type="button"
          :title="t('readingProgress.roadmap.map.zoomIn')"
          :aria-label="t('readingProgress.roadmap.map.zoomIn')"
          @click="zoomIn"
        >
          <UIcon name="i-lucide-plus" aria-hidden="true" />
        </button>
        <button
          type="button"
          :title="t('readingProgress.roadmap.map.fit')"
          :aria-label="t('readingProgress.roadmap.map.fit')"
          @click="fitCanvas"
        >
          <UIcon name="i-lucide-maximize-2" aria-hidden="true" />
        </button>
      </div>

      <div v-if="!positionedModules.length" class="empty-state">
        <h3>{{ t("readingProgress.roadmap.quest.emptyTitle") }}</h3>
        <p>{{ t("readingProgress.roadmap.quest.emptyBody") }}</p>
      </div>

      <div v-else ref="stageScroll" class="stage-scroll">
        <div
          class="stage-canvas"
          :style="{
            width: canvasSize.width + 'px',
            height: canvasSize.height + 'px',
            '--map-scale': zoom,
          }"
        >
          <svg
            class="branch-lines"
            :viewBox="`0 0 ${canvasSize.width} ${canvasSize.height}`"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              v-for="edge in visibleEdges"
              :key="edge.key"
              :d="edgePath(edge)"
              :class="edgeClass(edge)"
            />
          </svg>

          <div
            v-for="track in visibleTrackLabels"
            :key="track.category"
            class="track-label"
            :style="{
              left: track.x + 'px',
              top: track.y + 'px',
              '--track-color': track.color,
            }"
          >
            <span>{{ track.index }}</span>
            {{ categoryLabel(track.category) }}
          </div>

          <button
            v-for="module in positionedModules"
            :key="module.key"
            :ref="(el) => setModuleRef(module, el)"
            class="quest-node"
            type="button"
            :class="moduleClass(module)"
            :style="{
              left: module.x + 'px',
              top: module.y + 'px',
              '--track-color': module.color,
            }"
            @click="selectModule(module)"
          >
            <span class="node-top">
              <span class="node-id">{{ module.shortId }}</span>
              <span v-if="isHighlightedModule(module)" class="next-badge">
                {{ t("readingProgress.roadmap.quest.next") }}
              </span>
            </span>

            <span class="node-category">{{ categoryLabel(module.category) }}</span>
            <strong>{{ module.name }}</strong>

            <span class="node-progress">
              <span :style="{ width: module.percent + '%' }" />
            </span>

            <span class="node-meta">
              {{ module.completed }} / {{ module.total }}
              ·
              {{ t("readingProgress.roadmap.quest.moduleSteps", { count: module.total }) }}
            </span>

            <span v-if="module.status === 'locked'" class="locked-by">
              {{ t("readingProgress.roadmap.quest.locked") }}
            </span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import { resourceCategoryLabel } from "~/utils/resourceCategories";

const { t } = useI18n();

const props = defineProps({
  nodes: { type: Array, required: true },
  zoom: { type: Number, default: 1 },
  search: { type: String, default: "" },
  category: { type: String, default: "" },
  hideLocked: { type: Boolean, default: false },
  focusIds: { type: Array, default: null },
  highlightEdges: { type: Array, default: null },
  highlightId: { type: [String, null], default: null },
  activeId: { type: [String, null], default: null },
  nextSeq: { type: [Number, null], default: null },
  isCompleted: { type: Function, required: true },
  canUnlock: { type: Function, required: true },
});

const emit = defineEmits(["select", "update:zoom", "filter-category"]);

const trackColors = [
  "#d08a3f",
  "#6ea8fe",
  "#8dd3c7",
  "#f0c36d",
  "#c084fc",
  "#f472b6",
  "#a3e635",
  "#f87171",
];

const minimumCanvasSize = {
  width: 1320,
  height: 980,
};

const categoryLayouts = {
  fonaments: { x: 150, y: 520, step: 260 },
  "llenguatge-musical": { x: 620, y: 285, step: 260 },
  harmonia: { x: 1080, y: 130, step: 260 },
  produccio: { x: 1180, y: 455, step: 260 },
  gravacio: { x: 620, y: 790, step: 260 },
  edicio: { x: 1450, y: 945, step: 260 },
  mescla: { x: 1740, y: 655, step: 245 },
  "disseny-de-so": { x: 2020, y: 285, step: 245 },
};

const laneWave = [0, -22, 18, -14, 14];
const minZoom = 0.35;
const maxZoom = 1.2;
const zoomStep = 0.1;

const moduleRefs = new Map();
const stageScroll = ref(null);

function normId(id) {
  return String(id || "")
    .trim()
    .toUpperCase();
}

function moduleKeyFor(node) {
  return `${String(node.category || "Altres")}|||${String(
    node.module || t("readingProgress.roadmap.atlas.noModule")
  )}`;
}

function categoryLabel(category) {
  return resourceCategoryLabel(category, t);
}

function sortedBySeq(nodes) {
  return [...nodes].sort((a, b) => {
    const seqA = Number.isFinite(a.seq) ? a.seq : 999999;
    const seqB = Number.isFinite(b.seq) ? b.seq : 999999;
    return seqA - seqB;
  });
}

const allNodesSorted = computed(() => sortedBySeq(props.nodes || []));

const categoryOrder = computed(() => {
  const seen = new Map();
  for (const node of allNodesSorted.value) {
    const categoryName = String(node.category || "Altres");
    if (!seen.has(categoryName)) seen.set(categoryName, seen.size);
  }
  return Array.from(seen.keys());
});

function categoryColor(category) {
  const index = categoryOrder.value.indexOf(String(category));
  return trackColors[index >= 0 ? index % trackColors.length : 0];
}

const focusSet = computed(() => {
  if (!props.focusIds) return null;
  return new Set(props.focusIds.map(normId));
});

const moduleByNodeId = computed(() => {
  const map = new Map();
  for (const module of modules.value) {
    for (const node of module.nodes) map.set(normId(node.id), module.key);
  }
  return map;
});

const modules = computed(() => {
  const groups = new Map();

  for (const node of allNodesSorted.value) {
    const key = moduleKeyFor(node);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        category: String(node.category || "Altres"),
        categorySlug: String(node.categorySlug || node.category || "altres"),
        name: String(node.module || t("readingProgress.roadmap.atlas.noModule")),
        seq: Number.isFinite(node.seq) ? node.seq : 999999,
        nodes: [],
      });
    }
    const group = groups.get(key);
    group.nodes.push(node);
    group.seq = Math.min(group.seq, Number.isFinite(node.seq) ? node.seq : 999999);
  }

  return Array.from(groups.values())
    .sort((a, b) => a.seq - b.seq)
    .map((module, index) => {
      const nodes = sortedBySeq(module.nodes);
      const completed = nodes.filter((node) => props.isCompleted(node.id)).length;
      const total = nodes.length;
      const incompleteNodes = nodes.filter((node) => !props.isCompleted(node.id));
      const availableNodes = incompleteNodes.filter((node) => props.canUnlock(node));
      const isDone = total > 0 && completed === total;
      const isStarted = completed > 0;
      const status = isDone
        ? "completed"
        : availableNodes.length || isStarted
          ? "available"
          : "locked";
      const nextNode = availableNodes[0] || incompleteNodes[0] || nodes[0] || null;

      return {
        ...module,
        index,
        nodes,
        completed,
        total,
        percent: total ? Math.round((completed / total) * 100) : 0,
        status,
        nextNode,
        color: categoryColor(module.category),
      };
    });
});

const moduleMap = computed(() => {
  const map = new Map();
  for (const module of modules.value) map.set(module.key, module);
  return map;
});

const moduleEdges = computed(() => {
  const nodeToModule = new Map();
  for (const module of modules.value) {
    for (const node of module.nodes) nodeToModule.set(normId(node.id), module.key);
  }

  const edges = new Map();
  for (const node of allNodesSorted.value) {
    const to = nodeToModule.get(normId(node.id));
    for (const prereq of node.prereqIds || []) {
      const from = nodeToModule.get(normId(prereq));
      if (from && to && from !== to) {
        edges.set(`${from}=>${to}`, { key: `${from}=>${to}`, from, to });
      }
    }
  }

  return Array.from(edges.values());
});

function moduleMatchesFilters(module) {
  if (!module) return false;

  if (focusSet.value) {
    return module.nodes.some((node) => focusSet.value.has(normId(node.id)));
  }

  if (props.category && module.category !== props.category) return false;

  const q = String(props.search || "")
    .trim()
    .toLowerCase();
  if (q) {
    const haystack = [
      module.category,
      module.name,
      module.nodes.map((node) => [node.id, node.title, node.objective, node.tags].join(" ")).join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(q)) return false;
  }

  if (props.hideLocked && module.status === "locked") return false;

  return true;
}

const visibleModules = computed(() => modules.value.filter(moduleMatchesFilters));

const positionedModules = computed(() => {
  const byCategory = new Map();
  for (const module of modules.value) {
    if (!byCategory.has(module.category)) byCategory.set(module.category, []);
    byCategory.get(module.category).push(module);
  }

  const positions = new Map();
  for (const [category, categoryModules] of byCategory.entries()) {
    const categoryIndex = categoryOrder.value.indexOf(category);
    const categorySlug = String(categoryModules[0]?.categorySlug || category)
      .trim()
      .toLowerCase();
    const layout = categoryLayouts[categorySlug] || {
      x: 160,
      y: 150 + Math.max(0, categoryIndex) * 150,
      step: 260,
    };

    categoryModules.forEach((module, moduleIndex) => {
      positions.set(module.key, {
        x: layout.x + moduleIndex * layout.step,
        y: layout.y + laneWave[moduleIndex % laneWave.length],
      });
    });
  }

  return visibleModules.value.map((module) => {
    const point = positions.get(module.key) || { x: 50, y: 50 };
    const categoryIndex = categoryOrder.value.indexOf(module.category);
    const categoryModules = byCategory.get(module.category) || [];
    const moduleIndex = categoryModules.findIndex((item) => item.key === module.key);

    return {
      ...module,
      ...point,
      shortId: `${String(categoryIndex + 1).padStart(2, "0")}.${String(
        moduleIndex + 1
      ).padStart(2, "0")}`,
    };
  });
});

const visibleTrackLabels = computed(() => {
  const tracks = [];

  for (const categoryName of categoryOrder.value) {
    const categoryModules = positionedModules.value.filter(
      (module) => module.category === categoryName
    );
    if (!categoryModules.length) continue;

    tracks.push({
      category: categoryName,
      color: categoryColor(categoryName),
      index: String(categoryOrder.value.indexOf(categoryName) + 1).padStart(2, "0"),
      x: Math.max(24, Math.min(...categoryModules.map((module) => module.x)) - 96),
      y: Math.max(22, Math.min(...categoryModules.map((module) => module.y)) - 98),
    });
  }

  return tracks;
});

const canvasSize = computed(() => {
  if (!positionedModules.value.length) return minimumCanvasSize;

  const maxX = Math.max(...positionedModules.value.map((module) => module.x));
  const maxY = Math.max(...positionedModules.value.map((module) => module.y));

  return {
    width: Math.max(minimumCanvasSize.width, maxX + 340),
    height: Math.max(minimumCanvasSize.height, maxY + 260),
  };
});

const zoomPercent = computed(() => Math.round(props.zoom * 100));

function clampZoom(value) {
  return Math.min(maxZoom, Math.max(minZoom, Number(value.toFixed(2))));
}

function setZoom(value) {
  emit("update:zoom", clampZoom(value));
}

function zoomIn() {
  setZoom(props.zoom + zoomStep);
}

function zoomOut() {
  setZoom(props.zoom - zoomStep);
}

async function fitCanvas() {
  await nextTick();
  const el = stageScroll.value;
  if (!el) return;

  const fit = Math.min(
    (el.clientWidth - 32) / canvasSize.value.width,
    (el.clientHeight - 32) / canvasSize.value.height
  );

  setZoom(fit);
  el.scrollTo({ left: 0, top: 0, behavior: "smooth" });
}

const visibleModuleMap = computed(() => {
  const map = new Map();
  for (const module of positionedModules.value) map.set(module.key, module);
  return map;
});

const visibleEdges = computed(() =>
  moduleEdges.value.filter(
    (edge) => visibleModuleMap.value.has(edge.from) && visibleModuleMap.value.has(edge.to)
  )
);

function edgePath(edge) {
  const from = visibleModuleMap.value.get(edge.from);
  const to = visibleModuleMap.value.get(edge.to);
  if (!from || !to) return "";

  const sx = from.x;
  const sy = from.y;
  const tx = to.x;
  const ty = to.y;
  const distance = Math.max(80, Math.abs(tx - sx));
  const c1x = sx + distance * 0.52;
  const c2x = tx - distance * 0.48;

  return `M ${sx} ${sy} C ${c1x} ${sy}, ${c2x} ${ty}, ${tx} ${ty}`;
}

function edgeClass(edge) {
  const from = moduleMap.value.get(edge.from);
  const to = moduleMap.value.get(edge.to);
  return {
    edge: true,
    completed: from?.status === "completed" && to?.status !== "locked",
    highlighted:
      isHighlightedModule(from) ||
      isHighlightedModule(to) ||
      isActiveModule(from) ||
      isActiveModule(to),
  };
}

function setModuleRef(module, el) {
  if (!el) return;
  moduleRefs.set(module.key, el);
  for (const node of module.nodes) moduleRefs.set(normId(node.id), el);
}

function selectModule(module) {
  if (!module?.nextNode) return;
  emit("select", module.nextNode.id);
}

function isHighlightedModule(module) {
  if (!module || !props.highlightId) return false;
  return module.key === moduleByNodeId.value.get(normId(props.highlightId));
}

function isActiveModule(module) {
  if (!module || !props.activeId) return false;
  return module.key === moduleByNodeId.value.get(normId(props.activeId));
}

function moduleClass(module) {
  return {
    completed: module.status === "completed",
    available: module.status === "available",
    locked: module.status === "locked",
    highlighted: isHighlightedModule(module),
    active: isActiveModule(module),
  };
}

function lockedLabel(module) {
  const blockers = moduleEdges.value
    .filter((edge) => edge.to === module.key)
    .map((edge) => moduleMap.value.get(edge.from))
    .filter((from) => from && from.status !== "completed")
    .slice(0, 2);

  if (!blockers.length) return t("readingProgress.roadmap.quest.locked");
  return t("readingProgress.roadmap.quest.lockedBy", {
    modules: blockers.map((item) => item.name).join(", "),
  });
}

async function scrollToNode(id) {
  await nextTick();
  const el = moduleRefs.get(normId(id)) || moduleRefs.get(String(id));
  el?.scrollIntoView?.({ behavior: "smooth", block: "center", inline: "center" });
}

function fitToScreen() {
  if (!import.meta.client) return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function centerNextNode() {
  if (!props.highlightId) return;
  scrollToNode(props.highlightId);
}

defineExpose({ scrollToNode, fitToScreen, centerNextNode });
</script>

<style scoped>
.quest-shell {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.quest-intro,
.quest-stage {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-1);
}

.quest-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.5rem;
  align-items: end;
  padding: 1.5rem;
}

.quest-kicker {
  margin: 0 0 0.45rem;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.quest-intro h2 {
  margin: 0;
  color: var(--text);
  font-size: 2rem;
  line-height: 1.08;
}

.quest-intro p:not(.quest-kicker) {
  max-width: 74ch;
  margin: 0.75rem 0 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: flex-end;
  color: var(--text-secondary);
  font-size: 0.86rem;
}

.legend span {
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  min-height: 32px;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-2);
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--text-secondary);
}

.dot.available {
  background: #6ea8fe;
}

.dot.done {
  background: var(--accent);
}

.dot.locked {
  background: #6b7280;
}

.quest-stage {
  position: relative;
  overflow: hidden;
}

.map-toolbar {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  z-index: 8;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  box-shadow: var(--shadow-1);
  backdrop-filter: blur(14px);
}

.map-toolbar button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text);
  cursor: pointer;
}

.map-toolbar button:hover {
  background: var(--surface-2);
  color: var(--accent);
}

.map-toolbar span {
  min-width: 44px;
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 850;
  text-align: center;
}

.stage-scroll {
  overflow: auto;
  padding: 1rem;
  min-height: 620px;
  max-height: min(76vh, 900px);
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable both-edges;
}

.stage-canvas {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 8px;
  background:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(208, 138, 63, 0.06), transparent 38%),
    var(--surface-2);
  background-size: 40px 40px, 40px 40px, auto, auto;
  transform: scale(var(--map-scale));
  transform-origin: top left;
}

:root[data-theme="light"] .stage-canvas {
  background:
    linear-gradient(rgba(20, 20, 20, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20, 20, 20, 0.04) 1px, transparent 1px),
    linear-gradient(180deg, rgba(208, 138, 63, 0.08), transparent 38%),
    var(--surface-2);
  background-size: 40px 40px, 40px 40px, auto, auto;
}

.branch-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.track-label {
  position: absolute;
  z-index: 1;
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  min-height: 34px;
  padding: 0.35rem 0.65rem;
  border: 1px solid color-mix(in srgb, var(--track-color) 50%, var(--border));
  border-radius: 999px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--track-color) 13%, transparent), transparent),
    color-mix(in srgb, var(--surface) 88%, black);
  color: var(--text);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: var(--shadow-1);
  pointer-events: none;
}

.track-label span {
  color: var(--track-color);
}

.edge {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-dasharray: 9 10;
}

:root[data-theme="light"] .edge {
  stroke: rgba(20, 20, 20, 0.12);
}

.edge.completed {
  stroke: rgba(208, 138, 63, 0.52);
  stroke-dasharray: none;
}

.edge.highlighted {
  stroke: var(--accent);
  stroke-width: 3;
  stroke-dasharray: none;
  filter: drop-shadow(0 0 8px rgba(208, 138, 63, 0.45));
}

.quest-node {
  position: absolute;
  z-index: 2;
  width: 220px;
  height: 164px;
  display: grid;
  grid-template-rows: auto auto minmax(2.35rem, auto) auto auto auto;
  gap: 0.34rem;
  transform: translate(-50%, -50%);
  padding: 0.85rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--track-color) 13%, transparent), transparent 46%),
    color-mix(in srgb, var(--surface) 96%, #050505);
  color: var(--text);
  text-align: left;
  cursor: pointer;
  box-shadow: var(--shadow-1);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.quest-node:hover {
  transform: translate(-50%, calc(-50% - 4px));
  border-color: color-mix(in srgb, var(--track-color) 65%, var(--border));
  box-shadow: var(--shadow-2);
}

.quest-node.locked {
  opacity: 0.72;
}

.quest-node.completed {
  border-color: color-mix(in srgb, var(--track-color) 72%, var(--border));
}

.quest-node.highlighted,
.quest-node.active {
  border-color: var(--track-color);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--track-color) 24%, transparent),
    var(--shadow-2);
}

.node-top {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
}

.node-id,
.node-category,
.next-badge,
.node-meta,
.locked-by {
  font-size: 0.74rem;
  font-weight: 850;
  line-height: 1.2;
}

.node-id {
  color: var(--track-color);
}

.next-badge {
  padding: 0.2rem 0.42rem;
  border-radius: 999px;
  background: var(--track-color);
  color: #0a0a0a;
}

.node-category {
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.quest-node strong {
  color: var(--text);
  font-size: 0.98rem;
  line-height: 1.16;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 2.3rem;
}

.node-progress {
  display: block;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

:root[data-theme="light"] .node-progress {
  background: rgba(20, 20, 20, 0.08);
}

.node-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--track-color);
}

.node-meta {
  color: var(--text-secondary);
  font-size: 0.72rem;
  white-space: nowrap;
}

.locked-by {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.22rem 0.46rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-secondary);
  overflow: hidden;
  white-space: nowrap;
}

.empty-state {
  padding: 2rem;
  text-align: center;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  color: var(--text);
}

.empty-state p {
  margin: 0;
  color: var(--text-secondary);
}

@media (max-width: 820px) {
  .quest-intro {
    grid-template-columns: 1fr;
    padding: 1.2rem;
  }

  .legend {
    justify-content: flex-start;
  }

  .stage-scroll {
    padding: 0.75rem;
    min-height: 560px;
  }

  .quest-node {
    width: 198px;
    height: 160px;
  }
}
</style>
