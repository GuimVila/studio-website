<script setup>
import { ref, computed } from "vue";
import { buildTopoIndex, getNextBestNode } from "~/utils/roadmapNext";
import { computeFocusSet } from "~/utils/roadmapFocus";
import { useRoadmapProgress } from "~/composables/useRoadmapProgress";

// Carreguem des de /public/roadmap.json (copiat des de data/roadmap.json)
const { data: roadmapData } = await useFetch("/roadmap.json");
const data = computed(() => roadmapData.value || { nodes: [] });

const {
  completed,
  lastCompletedId,
  streak,
  isCompleted,
  setCompleted,
  canUnlock,
  resetAll,
} = useRoadmapProgress();

function norm(id) {
  return String(id).trim().toUpperCase();
}

const completedUpper = computed(() => {
  const s = new Set();
  for (const id of completed.value) s.add(norm(id));
  return s;
});

const search = ref("");
const category = ref("");
const hideLocked = ref(false);
const zoom = ref(1);
const focusMode = ref(false);

const categories = computed(() =>
  Array.from(new Set((data.value.nodes || []).map((n) => n.category))).sort()
);

const topoIndex = computed(() => buildTopoIndex(data.value.nodes || []));

const preferredCategory = computed(() => {
  if (category.value) return category.value;

  const last = lastCompletedId.value
    ? (data.value.nodes || []).find(
        (n) => norm(n.id) === norm(lastCompletedId.value)
      )
    : null;

  return last?.category ?? null;
});

const nextNode = computed(() => {
  return getNextBestNode({
    nodes: data.value.nodes || [],
    topoIndex: topoIndex.value,
    completedIds: completedUpper.value,
    canUnlock,
    preferredCategory: preferredCategory.value,
  });
});

const nextId = computed(() => nextNode.value?.id ?? null);
const nextTitle = computed(() => nextNode.value?.title ?? null);
const nextSeq = computed(() => nextNode.value?.seq ?? null);

const focusPack = computed(() => {
  if (!focusMode.value || !nextId.value) return null;
  return computeFocusSet({
    nodes: data.value.nodes || [],
    nextId: nextId.value,
    completedIds: completedUpper.value,
    includeNearbyBranches: true,
  });
});

const focusIds = computed(() => focusPack.value?.focusIds ?? null);
const highlightEdges = computed(() => focusPack.value?.highlightEdges ?? null);

const completedCount = computed(() => completedUpper.value.size);
const totalCount = computed(() => (data.value.nodes || []).length);

const sidebarOpen = ref(false);
const selectedId = ref(null);

const selectedNode = computed(() => {
  if (!selectedId.value) return null;
  return (
    (data.value.nodes || []).find(
      (n) => norm(n.id) === norm(selectedId.value)
    ) ?? null
  );
});

/** @param {string} id */
function selectNode(id) {
  selectedId.value = id;
  sidebarOpen.value = true;
}

const mapRef = ref(null);

function goNext() {
  if (!nextNode.value) return;
  selectNode(nextNode.value.id);
  mapRef.value?.scrollToNode?.(nextNode.value.id);
}

function toggleComplete() {
  if (!selectedNode.value) return;
  const id = selectedNode.value.id;
  if (!canUnlock(selectedNode.value) && !isCompleted(id)) return;
  setCompleted(id, !isCompleted(id));
}

/** @param {string} id */
function jumpTo(id) {
  selectNode(id);
  mapRef.value?.scrollToNode?.(id);
}

/** @param {string} id */
function onSelect(id) {
  selectNode(id);
  mapRef.value?.scrollToNode?.(id);
}
</script>

<template>
  <div class="page">
    <header class="hero">
      <h1>Roadmap d’aprenentatge</h1>
      <p>Camí amb prerequisits, branques, focus i un “següent pas” recomanat.</p>
    </header>

    <RoadmapControls
      :categories="categories"
      :next-id="nextId"
      :next-title="nextTitle"
      :search="search"
      :category="category"
      :hide-locked="hideLocked"
      :zoom="zoom"
      :focus-mode="focusMode"
      @update:search="search = $event"
      @update:category="category = $event"
      @update:hide-locked="hideLocked = $event"
      @update:focus-mode="focusMode = $event"
      @update:zoom="zoom = $event"
      @reset="resetAll"
      @next="goNext"
    />

    <RoadmapHUD
      :completed-count="completedCount"
      :total-count="totalCount"
      :streak="streak"
    />

    <RoadmapMap
      ref="mapRef"
      class="map"
      :nodes="data.nodes"
      :zoom="zoom"
      :search="search"
      :category="category"
      :hide-locked="hideLocked"
      :focus-ids="focusIds"
      :highlight-edges="highlightEdges"
      :highlight-id="nextId"
      :next-seq="nextSeq"
      :is-completed="isCompleted"
      :can-unlock="canUnlock"
      @select="onSelect"
    />

    <RoadmapSidebar
      :open="sidebarOpen"
      :node="selectedNode"
      :completed="selectedNode ? isCompleted(selectedNode.id) : false"
      :unlockable="selectedNode ? canUnlock(selectedNode) : false"
      :is-completed="isCompleted"
      @close="sidebarOpen = false"
      @toggle-complete="toggleComplete"
      @jump="jumpTo"
    />
  </div>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 16px 40px;
  color: white;
}
.hero {
  margin-bottom: 14px;
}
.hero h1 {
  font-size: 28px;
  margin-bottom: 10px;
}
.hero p {
  opacity: 0.85;
  line-height: 1.5;
  max-width: 78ch;
}
.map {
  margin-top: 14px;
}
</style>
