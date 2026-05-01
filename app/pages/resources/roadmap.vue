<template>
  <div class="page">
    <section class="roadmap-hero">
      <p class="hero-kicker">{{ $t("readingProgress.roadmap.eyebrow") }}</p>
      <h1>{{ $t("readingProgress.roadmap.title") }}</h1>
      <p>
        {{ $t("readingProgress.roadmap.intro") }}
      </p>
    </section>

    <section class="progress-account">
      <div>
        <p class="eyebrow">
          {{
            userStore.isLoggedIn
              ? $t("readingProgress.roadmap.synced")
              : $t("readingProgress.roadmap.local")
          }}
        </p>
        <p v-if="userStore.isLoggedIn" class="account-copy">
          {{ $t("readingProgress.roadmap.connected") }}
          <strong>{{ userStore.user?.email }}</strong>.
          {{
            isSyncing
              ? $t("readingProgress.common.syncing")
              : $t("readingProgress.roadmap.saved")
          }}
        </p>
        <p v-else class="account-copy">
          {{ $t("readingProgress.roadmap.localCopy") }}
        </p>
        <p v-if="syncError" class="sync-error">{{ syncError }}</p>
      </div>

      <div v-if="!userStore.isLoggedIn" class="account-actions">
        <NuxtLink
          class="btn btn-primary"
          :to="{ path: localePath('/login'), query: { redirect: route.fullPath } }"
        >
          {{ $t("readingProgress.roadmap.login") }}
        </NuxtLink>
        <NuxtLink
          class="btn btn-secondary"
          :to="{ path: localePath('/register'), query: { redirect: route.fullPath } }"
        >
          {{ $t("readingProgress.roadmap.register") }}
        </NuxtLink>
      </div>
    </section>

    <RoadmapControls
      :categories="categories"
      :next-id="nextId"
      :next-title="nextTitle"
      :search="search"
      :category="category"
      :hide-locked="hideLocked"
      :focus-mode="focusMode"
      @update:search="search = $event"
      @update:category="category = $event"
      @update:hide-locked="hideLocked = $event"
      @update:focus-mode="focusMode = $event"
      @reset="confirmReset"
      @next="goNext"
    />

    <RoadmapHUD
      :completed-count="completedCount"
      :total-count="totalCount"
      :streak="streak"
      :estimated-minutes="estimatedMinutes"
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
      :active-id="selectedId"
      :next-seq="nextSeq"
      :is-completed="isCompleted"
      :can-unlock="canUnlock"
      @select="onSelect"
      @filter-category="category = $event"
    />

    <RoadmapSidebar
      :open="sidebarOpen"
      :node="selectedNode"
      :completed="selectedNode ? isCompleted(selectedNode.id) : false"
      :unlockable="selectedNode ? canUnlock(selectedNode) : false"
      :is-completed="isCompleted"
      :can-unlock-node="canUnlock"
      :module-nodes="selectedModuleNodes"
      @close="closeSidebar"
      @toggle-complete="toggleComplete"
      @jump="jumpTo"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";
import { buildTopoIndex, getNextBestNode } from "~/utils/roadmapNext";
import { computeFocusSet } from "~/utils/roadmapFocus";
import { useRoadmapProgress } from "~/composables/useRoadmapProgress";
import roadmap from "../../../data/roadmap.json";

const data = computed(() => roadmap || { nodes: [] });
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();
const localePath = useLocalePath();

const {
  completed,
  lastCompletedId,
  streak,
  isSyncing,
  syncError,
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

function queryValue(key) {
  const value = route.query[key];
  return Array.isArray(value) ? String(value[0] || "") : String(value || "");
}

const search = ref(queryValue("q"));
const category = ref(queryValue("cat"));
const hideLocked = ref(queryValue("hide") === "1");
const zoom = ref(1);
const focusMode = ref(queryValue("focus") === "1");

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
    canUnlock,
  });
});

const focusIds = computed(() => {
  const set = focusPack.value?.focusIds;
  return set ? Array.from(set) : null;
});
const highlightEdges = computed(() => {
  const set = focusPack.value?.highlightEdges;
  return set ? Array.from(set) : null;
});

const completedCount = computed(() => completedUpper.value.size);
const totalCount = computed(() => (data.value.nodes || []).length);

const estimatedMinutes = computed(() => {
  const nodes = data.value.nodes || [];
  let total = 0;
  for (const node of nodes) {
    if (!isCompleted(node.id) && node.estMinutes) {
      total += node.estMinutes;
    }
  }
  return total;
});

const sidebarOpen = ref(false);
const selectedId = ref(queryValue("node") || null);
const syncingRoute = ref(false);

const selectedNode = computed(() => {
  if (!selectedId.value) return null;
  return (
    (data.value.nodes || []).find(
      (n) => norm(n.id) === norm(selectedId.value)
    ) ?? null
  );
});

const selectedModuleNodes = computed(() => {
  if (!selectedNode.value) return [];
  return sortedBySeq(
    (data.value.nodes || []).filter(
      (node) =>
        node.category === selectedNode.value.category &&
        node.module === selectedNode.value.module
    )
  );
});

function sortedBySeq(nodes) {
  return [...nodes].sort((a, b) => {
    const seqA = Number.isFinite(a.seq) ? a.seq : 999999;
    const seqB = Number.isFinite(b.seq) ? b.seq : 999999;
    return seqA - seqB;
  });
}

/** @param {string} id */
function selectNode(id) {
  selectedId.value = id;
  sidebarOpen.value = true;
}

function closeSidebar() {
  sidebarOpen.value = false;
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

function confirmReset() {
  if (!import.meta.client) {
    resetAll();
    return;
  }

  const ok = window.confirm(
    t("readingProgress.roadmap.confirmReset")
  );

  if (ok) resetAll();
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

function syncQuery() {
  if (!import.meta.client || syncingRoute.value) return;

  const query = { ...route.query };
  delete query.q;
  delete query.cat;
  delete query.hide;
  delete query.focus;
  delete query.node;

  if (search.value.trim()) query.q = search.value.trim();
  if (category.value) query.cat = category.value;
  if (hideLocked.value) query.hide = "1";
  if (focusMode.value) query.focus = "1";
  if (sidebarOpen.value && selectedId.value) query.node = selectedId.value;

  router.replace({ query });
}

function applyRouteQuery() {
  syncingRoute.value = true;
  search.value = queryValue("q");
  category.value = queryValue("cat");
  hideLocked.value = queryValue("hide") === "1";
  focusMode.value = queryValue("focus") === "1";

  const node = queryValue("node");
  if (node) {
    selectedId.value = node;
    sidebarOpen.value = true;
    nextTick(() => mapRef.value?.scrollToNode?.(node));
  } else if (sidebarOpen.value) {
    sidebarOpen.value = false;
  }

  nextTick(() => {
    syncingRoute.value = false;
  });
}

watch(
  () => route.query,
  () => applyRouteQuery()
);

watch(
  [search, category, hideLocked, focusMode, selectedId, sidebarOpen],
  () => syncQuery()
);

onMounted(() => {
  if (selectedId.value) {
    sidebarOpen.value = true;
    nextTick(() => mapRef.value?.scrollToNode?.(selectedId.value));
  }
});
</script>

<style scoped>
.page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: var(--text);
  position: relative;
  isolation: isolate;
}

.roadmap-hero {
  max-width: 880px;
  margin: 0 0 1.5rem;
}

.hero-kicker {
  margin: 0 0 0.75rem;
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.roadmap-hero h1 {
  margin: 0;
  font-size: 3.35rem;
  font-weight: 950;
  line-height: 1.02;
  color: var(--text);
  background: linear-gradient(
    135deg,
    var(--text) 0%,
    var(--text) 50%,
    var(--accent) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.roadmap-hero p:not(.hero-kicker) {
  margin: 1rem 0 0;
  font-size: 1.08rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

.map {
  margin-top: 2rem;
}

.progress-account {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: center;
  margin: 0 0 1.5rem;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-1);
}

.eyebrow {
  margin: 0 0 0.35rem;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.account-copy {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.account-copy strong {
  color: var(--text);
}

.account-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.sync-error {
  margin: 0.75rem 0 0;
  color: #fca5a5;
  font-size: 0.92rem;
}

@media (max-width: 768px) {
  .page {
    padding: 3rem 1.5rem;
  }

  .roadmap-hero h1 {
    font-size: 2.45rem;
  }

  .progress-account {
    align-items: stretch;
    flex-direction: column;
  }

  .account-actions {
    justify-content: flex-start;
  }
}
</style>
