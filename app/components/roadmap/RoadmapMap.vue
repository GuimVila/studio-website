<template>
  <div class="atlas-shell">
    <div class="atlas-intro">
      <div>
        <p class="atlas-kicker">{{ t("readingProgress.roadmap.atlas.kicker") }}</p>
        <h2>
          {{
            category
              ? categoryLabel(category)
              : t("readingProgress.roadmap.atlas.title")
          }}
        </h2>
        <p>
          {{
            category
              ? t("readingProgress.roadmap.atlas.categoryIntro")
              : t("readingProgress.roadmap.atlas.intro")
          }}
        </p>
      </div>

      <div class="legend" aria-label="Roadmap legend">
        <span><i class="dot available" />{{ t("readingProgress.roadmap.atlas.available") }}</span>
        <span><i class="dot done" />{{ t("readingProgress.roadmap.atlas.completed") }}</span>
        <span><i class="dot locked" />{{ t("readingProgress.roadmap.atlas.locked") }}</span>
      </div>
    </div>

    <section
      v-if="showOverview"
      class="tracks-overview"
      aria-labelledby="roadmap-tracks-title"
    >
      <div class="overview-head">
        <p class="atlas-kicker">{{ t("readingProgress.roadmap.atlas.disciplines") }}</p>
        <h3 id="roadmap-tracks-title">
          {{ t("readingProgress.roadmap.atlas.disciplinesTitle") }}
        </h3>
      </div>

      <div class="track-grid">
        <button
          v-for="(track, index) in trackSummaries"
          :key="track.category"
          class="track-card"
          type="button"
          :style="{ '--track-color': track.color }"
          @click="emit('filter-category', track.category)"
        >
          <span class="track-number">{{ String(index + 1).padStart(2, "0") }}</span>
          <h4>{{ categoryLabel(track.category) }}</h4>
          <p>
            {{
              t("readingProgress.roadmap.atlas.trackSummary", {
                modules: track.modules.length,
                resources: track.total,
              })
            }}
          </p>

          <div class="mini-progress">
            <span :style="{ width: track.percent + '%' }" />
          </div>

          <div class="track-meta">
            <span>{{ track.completed }} / {{ track.total }}</span>
            <span>{{ track.percent }}%</span>
          </div>

          <div class="module-preview">
            <span v-for="module in track.modules.slice(0, 3)" :key="module">
              {{ module }}
            </span>
          </div>

          <strong>{{ t("readingProgress.roadmap.atlas.exploreTrack") }}</strong>
        </button>
      </div>
    </section>

    <section class="journey-board" aria-live="polite">
      <div v-if="!renderedGroups.length" class="empty-state">
        <h3>{{ t("readingProgress.roadmap.atlas.emptyTitle") }}</h3>
        <p>{{ t("readingProgress.roadmap.atlas.emptyBody") }}</p>
      </div>

      <article
        v-for="group in renderedGroups"
        :key="group.category"
        class="track-section"
        :style="{ '--track-color': group.color }"
      >
        <header class="track-header">
          <div>
            <span class="atlas-kicker">{{ t("readingProgress.roadmap.atlas.discipline") }}</span>
            <h3>{{ categoryLabel(group.category) }}</h3>
          </div>
          <div class="track-score">
            <strong>{{ group.completed }} / {{ group.total }}</strong>
            <span>{{ t("readingProgress.roadmap.atlas.doneInTrack") }}</span>
          </div>
        </header>

        <div class="modules">
          <section
            v-for="module in group.modules"
            :key="`${group.category}-${module.name}`"
            class="module-block"
          >
            <aside class="module-meta">
              <span class="module-count">
                {{ module.completed }} / {{ module.nodes.length }}
              </span>
              <h4>{{ module.name }}</h4>
              <p>
                {{
                  t("readingProgress.roadmap.atlas.moduleSummary", {
                    count: module.nodes.length,
                  })
                }}
              </p>
            </aside>

            <div class="lesson-list">
              <button
                v-for="node in module.nodes"
                :key="node.id"
                :ref="(el) => setNodeRef(node.id, el)"
                class="lesson-card"
                type="button"
                :class="nodeClass(node)"
                @click="emit('select', node.id)"
              >
                <span class="lesson-seq">{{ node.id }}</span>
                <span v-if="isNext(node)" class="next-badge">
                  {{ t("readingProgress.roadmap.atlas.next") }}
                </span>

                <h5>{{ node.title }}</h5>
                <p v-if="node.objective">{{ node.objective }}</p>

                <div class="lesson-footer">
                  <span>{{ statusLabel(node) }}</span>
                  <span v-if="node.estMinutes">~{{ node.estMinutes }} min</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick } from "vue";
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

const nodeRefs = new Map();

function setNodeRef(id, el) {
  if (el) nodeRefs.set(normId(id), el);
}

function normId(id) {
  return String(id || "")
    .trim()
    .toUpperCase();
}

function categoryLabel(category) {
  return resourceCategoryLabel(category, t);
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

function matchesFilters(node) {
  if (!node) return false;

  if (focusSet.value && !focusSet.value.has(normId(node.id))) return false;
  if (!focusSet.value && props.category && node.category !== props.category) {
    return false;
  }

  const q = String(props.search || "")
    .trim()
    .toLowerCase();
  if (q) {
    const haystack = [
      node.id,
      node.title,
      node.objective,
      node.module,
      node.category,
      node.tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(q)) return false;
  }

  if (props.hideLocked && !props.isCompleted(node.id) && !props.canUnlock(node)) {
    return false;
  }

  return true;
}

const visibleNodes = computed(() => sortedBySeq((props.nodes || []).filter(matchesFilters)));

const showOverview = computed(
  () => !props.category && !props.search.trim() && !focusSet.value
);

const trackSummaries = computed(() =>
  categoryOrder.value.map((category) => {
    const nodes = allNodesSorted.value.filter((node) => node.category === category);
    const modules = Array.from(new Set(nodes.map((node) => node.module).filter(Boolean)));
    const completed = nodes.filter((node) => props.isCompleted(node.id)).length;
    const total = nodes.length;

    return {
      category,
      modules,
      completed,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
      color: categoryColor(category),
    };
  })
);

const renderedGroups = computed(() => {
  const groups = new Map();

  for (const node of visibleNodes.value) {
    const categoryName = String(node.category || "Altres");
    if (!groups.has(categoryName)) {
      groups.set(categoryName, {
        category: categoryName,
        color: categoryColor(categoryName),
        nodes: [],
      });
    }
    groups.get(categoryName).nodes.push(node);
  }

  return Array.from(groups.values()).map((group) => {
    const moduleMap = new Map();
    for (const node of group.nodes) {
      const moduleName = String(node.module || t("readingProgress.roadmap.atlas.noModule"));
      if (!moduleMap.has(moduleName)) moduleMap.set(moduleName, []);
      moduleMap.get(moduleName).push(node);
    }

    const modules = Array.from(moduleMap.entries()).map(([name, nodes]) => ({
      name,
      nodes,
      completed: nodes.filter((node) => props.isCompleted(node.id)).length,
    }));

    return {
      ...group,
      modules,
      total: group.nodes.length,
      completed: group.nodes.filter((node) => props.isCompleted(node.id)).length,
    };
  });
});

function sortedBySeq(nodes) {
  return [...nodes].sort((a, b) => {
    const seqA = Number.isFinite(a.seq) ? a.seq : 999999;
    const seqB = Number.isFinite(b.seq) ? b.seq : 999999;
    return seqA - seqB;
  });
}

function isNext(node) {
  return props.highlightId && normId(node.id) === normId(props.highlightId);
}

function nodeClass(node) {
  const completed = props.isCompleted(node.id);
  const unlockable = props.canUnlock(node);
  return {
    completed,
    locked: !completed && !unlockable,
    available: !completed && unlockable,
    highlighted: isNext(node),
  };
}

function statusLabel(node) {
  if (props.isCompleted(node.id)) {
    return t("readingProgress.roadmap.atlas.completed");
  }

  if (props.canUnlock(node)) {
    return t("readingProgress.roadmap.atlas.available");
  }

  return t("readingProgress.roadmap.atlas.locked");
}

async function scrollToNode(id) {
  await nextTick();
  const el = nodeRefs.get(normId(id));
  el?.scrollIntoView?.({ behavior: "smooth", block: "center", inline: "nearest" });
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
.atlas-shell {
  display: grid;
  gap: 1.5rem;
  min-width: 0;
}

.atlas-intro,
.tracks-overview,
.track-section {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-1);
}

.atlas-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.5rem;
  align-items: end;
  padding: 1.5rem;
}

.atlas-kicker {
  margin: 0 0 0.45rem;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.atlas-intro h2,
.overview-head h3,
.track-header h3 {
  margin: 0;
  color: var(--text);
  line-height: 1.08;
}

.atlas-intro h2 {
  font-size: 2rem;
}

.atlas-intro p:not(.atlas-kicker),
.overview-head p,
.track-card p,
.module-meta p,
.lesson-card p {
  color: var(--text-secondary);
}

.atlas-intro p:not(.atlas-kicker) {
  max-width: 74ch;
  margin: 0.75rem 0 0;
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

.tracks-overview {
  padding: 1.5rem;
}

.overview-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
}

.overview-head h3 {
  font-size: 1.45rem;
}

.track-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.track-card {
  position: relative;
  display: flex;
  min-height: 270px;
  flex-direction: column;
  align-items: stretch;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--track-color) 13%, transparent), transparent 42%),
    var(--surface-2);
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.track-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--track-color) 62%, var(--border));
  box-shadow: var(--shadow-2);
}

.track-number {
  color: var(--track-color);
  font-weight: 900;
  font-size: 0.86rem;
}

.track-card h4 {
  margin: 0.75rem 0 0.45rem;
  font-size: 1.08rem;
  line-height: 1.15;
}

.track-card p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.45;
}

.mini-progress {
  height: 6px;
  margin-top: 1rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

:root[data-theme="light"] .mini-progress {
  background: rgba(20, 20, 20, 0.08);
}

.mini-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--track-color);
}

.track-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 0.45rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.module-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 1rem;
}

.module-preview span {
  max-width: 100%;
  padding: 0.28rem 0.48rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.74rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-card strong {
  margin-top: auto;
  padding-top: 1rem;
  color: var(--track-color);
  font-size: 0.92rem;
}

.journey-board {
  display: grid;
  gap: 1rem;
}

.track-section {
  overflow: hidden;
}

.track-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
  padding: 1.4rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--track-color) 12%, transparent), transparent 62%),
    var(--surface);
}

.track-header h3 {
  font-size: 1.65rem;
}

.track-score {
  min-width: 118px;
  text-align: right;
}

.track-score strong {
  display: block;
  color: var(--track-color);
  font-size: 1.2rem;
}

.track-score span {
  color: var(--text-secondary);
  font-size: 0.82rem;
}

.modules {
  display: grid;
}

.module-block {
  display: grid;
  grid-template-columns: minmax(190px, 0.28fr) minmax(0, 1fr);
  gap: 1rem;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.module-block:last-child {
  border-bottom: 0;
}

.module-meta {
  position: sticky;
  top: 92px;
  align-self: start;
}

.module-count {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  padding: 0.25rem 0.55rem;
  border: 1px solid color-mix(in srgb, var(--track-color) 50%, var(--border));
  border-radius: 999px;
  color: var(--track-color);
  font-size: 0.78rem;
  font-weight: 850;
}

.module-meta h4 {
  margin: 0.75rem 0 0.5rem;
  color: var(--text);
  font-size: 1.06rem;
  line-height: 1.22;
}

.module-meta p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
}

.lesson-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.lesson-card {
  position: relative;
  display: flex;
  min-height: 178px;
  flex-direction: column;
  align-items: stretch;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;
}

.lesson-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--track-color) 62%, var(--border));
  box-shadow: var(--shadow-1);
}

.lesson-card.locked {
  opacity: 0.54;
}

.lesson-card.completed {
  border-color: color-mix(in srgb, var(--track-color) 70%, var(--border));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--track-color) 10%, transparent), transparent),
    var(--surface-2);
}

.lesson-card.highlighted {
  border-color: var(--track-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--track-color) 22%, transparent);
}

.lesson-seq {
  color: var(--track-color);
  font-size: 0.78rem;
  font-weight: 900;
}

.next-badge {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  padding: 0.22rem 0.5rem;
  border-radius: 999px;
  background: var(--track-color);
  color: #0a0a0a;
  font-size: 0.7rem;
  font-weight: 900;
}

.lesson-card h5 {
  margin: 0.65rem 0 0.45rem;
  padding-right: 3.2rem;
  color: var(--text);
  font-size: 1rem;
  line-height: 1.22;
}

.lesson-card p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.42;
}

.lesson-footer {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.9rem;
  color: var(--text-secondary);
  font-size: 0.82rem;
}

.lesson-card.available .lesson-footer span:first-child {
  color: #6ea8fe;
}

.lesson-card.completed .lesson-footer span:first-child {
  color: var(--track-color);
}

.empty-state {
  padding: 2rem;
  border: 1px dashed var(--border);
  border-radius: 8px;
  text-align: center;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
}

.empty-state p {
  margin: 0;
  color: var(--text-secondary);
}

@media (max-width: 1100px) {
  .track-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lesson-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .atlas-intro,
  .track-header,
  .module-block {
    grid-template-columns: 1fr;
  }

  .atlas-intro {
    padding: 1.2rem;
  }

  .legend {
    justify-content: flex-start;
  }

  .track-grid {
    grid-template-columns: 1fr;
  }

  .track-card {
    min-height: auto;
  }

  .track-header,
  .module-block,
  .tracks-overview {
    padding: 1.15rem;
  }

  .track-score {
    text-align: left;
  }

  .module-meta {
    position: static;
  }

  .lesson-card {
    min-height: 0;
  }

  .lesson-card h5 {
    padding-right: 0;
  }

  .next-badge {
    position: static;
    align-self: flex-start;
    margin-top: 0.45rem;
  }
}
</style>
