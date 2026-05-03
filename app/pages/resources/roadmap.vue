<template>
  <div class="page">
    <section class="guide-hero">
      <p class="eyebrow">{{ $t("readingProgress.roadmap.eyebrow") }}</p>
      <h1>{{ $t("readingProgress.roadmap.title") }}</h1>
      <p>{{ $t("readingProgress.roadmap.intro") }}</p>
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

      <NuxtLink
        v-if="!userStore.isLoggedIn"
        class="login-link"
        :to="{ path: localePath('/login'), query: { redirect: route.fullPath } }"
      >
        {{ $t("readingProgress.roadmap.login") }}
      </NuxtLink>
    </section>

    <section class="path-picker">
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ $t("readingProgress.roadmap.guide.chooseKicker") }}</p>
          <h2>{{ $t("readingProgress.roadmap.guide.chooseTitle") }}</h2>
        </div>
        <p>{{ $t("readingProgress.roadmap.guide.chooseIntro") }}</p>
      </div>

      <div class="path-grid">
        <button
          v-for="path in guidePaths"
          :key="path.id"
          class="path-card"
          type="button"
          :class="{ active: selectedPathId === path.id }"
          @click="selectPath(path.id)"
        >
          <span class="path-icon">
            <UIcon :name="path.icon" aria-hidden="true" />
          </span>
          <span class="path-copy">
            <strong>{{ $t(path.titleKey) }}</strong>
            <span>{{ $t(path.descriptionKey) }}</span>
          </span>
          <small>
            {{
              $t("readingProgress.roadmap.guide.pathMeta", {
                count: pathStats(path).total,
                pending: pathStats(path).pending,
              })
            }}
          </small>
        </button>
      </div>
    </section>

    <section class="quick-search-panel">
      <div class="quick-search-copy">
        <p class="eyebrow">{{ $t("readingProgress.roadmap.guide.searchKicker") }}</p>
        <h2>{{ $t("readingProgress.roadmap.guide.searchTitle") }}</h2>
        <p>{{ $t("readingProgress.roadmap.guide.searchIntro") }}</p>
      </div>

      <button
        class="ghost-button search-toggle"
        type="button"
        :aria-expanded="searchOpen || isSearchActive"
        @click="toggleSearch"
      >
        <UIcon
          :name="searchOpen || isSearchActive ? 'i-lucide-x' : 'i-lucide-search'"
          aria-hidden="true"
        />
        {{
          searchOpen || isSearchActive
            ? $t("readingProgress.roadmap.guide.searchClose")
            : $t("readingProgress.roadmap.guide.searchOpen")
        }}
      </button>

      <label v-if="searchOpen || isSearchActive" class="search-form">
        <span>{{ $t("readingProgress.roadmap.guide.searchLabel") }}</span>
        <div class="search-box">
          <UIcon name="i-lucide-search" aria-hidden="true" />
          <input
            v-model="search"
            type="search"
            autocomplete="off"
            :placeholder="$t('readingProgress.roadmap.guide.searchPlaceholder')"
          >
        </div>
        <small>{{ $t("readingProgress.roadmap.guide.searchHint") }}</small>
      </label>
    </section>

    <section class="study-layout">
      <aside class="study-summary">
        <p class="eyebrow">{{ $t("readingProgress.roadmap.guide.currentPath") }}</p>
        <h2>{{ $t(selectedPath.titleKey) }}</h2>
        <p>{{ $t(selectedPath.descriptionKey) }}</p>

        <div class="progress-meter">
          <div>
            <strong>{{ completedInPath }}</strong>
            <span>/ {{ selectedPathNodes.length }}</span>
          </div>
          <div class="meter-track">
            <span :style="{ width: `${pathProgress}%` }" />
          </div>
          <small>{{ $t("readingProgress.roadmap.guide.completedInPath") }}</small>
        </div>

        <button class="reset-button" type="button" @click="confirmReset">
          <UIcon name="i-lucide-rotate-ccw" aria-hidden="true" />
          {{ $t("readingProgress.roadmap.guide.reset") }}
        </button>
      </aside>

      <div class="study-flow">
        <section v-if="nextNode" class="next-panel">
          <div>
            <p class="eyebrow">{{ $t("readingProgress.roadmap.guide.nextKicker") }}</p>
            <h2>{{ nextNode.title }}</h2>
            <p>{{ nodeSummary(nextNode) }}</p>
            <div class="lesson-meta">
              <span>{{ nextNode.id }}</span>
              <span>{{ categoryLabel(nextNode.category) }}</span>
              <span v-if="nextNode.estMinutes">
                {{
                  $t("readingProgress.roadmap.guide.minutes", {
                    count: nextNode.estMinutes,
                  })
                }}
              </span>
            </div>
          </div>

          <div class="next-actions">
            <NuxtLink class="primary-link" :to="resourcePath(nextNode)">
              {{ $t("readingProgress.roadmap.guide.openArticle") }}
              <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
            </NuxtLink>
            <button class="ghost-button" type="button" @click="toggleNode(nextNode)">
              {{
                isNodeRead(nextNode)
                  ? $t("readingProgress.article.markPending")
                  : $t("readingProgress.article.markRead")
              }}
            </button>
          </div>
        </section>

        <section v-else class="empty-panel">
          <p class="eyebrow">{{ $t("readingProgress.roadmap.guide.allDoneKicker") }}</p>
          <h2>{{ $t("readingProgress.roadmap.guide.allDoneTitle") }}</h2>
          <p>{{ $t("readingProgress.roadmap.guide.allDoneBody") }}</p>
        </section>

        <section class="lesson-section">
          <div class="section-head compact">
            <div>
              <p class="eyebrow">{{ $t("readingProgress.roadmap.guide.listKicker") }}</p>
              <h2>{{ listTitle }}</h2>
            </div>
            <p>{{ listIntro }}</p>
          </div>

          <div v-if="displayNodes.length" class="lesson-list">
            <article
              v-for="(node, index) in displayNodes"
              :key="node.id"
              class="lesson-card"
              :class="{ done: isNodeRead(node) }"
            >
              <span class="lesson-index">{{ String(index + 1).padStart(2, "0") }}</span>
              <div class="lesson-copy">
                <p>{{ node.id }} · {{ categoryLabel(node.category) }}</p>
                <h3>{{ node.title }}</h3>
                <span>{{ nodeSummary(node) }}</span>
                <div class="lesson-tags">
                  <small>{{ node.module }}</small>
                  <small v-if="node.estMinutes">
                    {{
                      $t("readingProgress.roadmap.guide.minutes", {
                        count: node.estMinutes,
                      })
                    }}
                  </small>
                </div>
              </div>

              <div class="lesson-actions">
                <NuxtLink :to="resourcePath(node)">
                  {{ $t("readingProgress.roadmap.guide.openArticle") }}
                </NuxtLink>
                <button type="button" @click="toggleNode(node)">
                  {{
                    isNodeRead(node)
                      ? $t("readingProgress.article.markPending")
                      : $t("readingProgress.article.markRead")
                  }}
                </button>
              </div>
            </article>
          </div>

          <div v-else class="empty-list">
            <h3>{{ $t("readingProgress.roadmap.guide.emptyTitle") }}</h3>
            <p>{{ $t("readingProgress.roadmap.guide.emptyBody") }}</p>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import {
  resourceCategoryLabel,
  resourceCategorySlug,
} from "~/utils/resourceCategories";
import roadmap from "../../../data/roadmap.json";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const localePath = useLocalePath();
const { t } = useI18n();

const {
  isSyncing,
  syncError,
  isRead,
  setRead,
  reset,
} = useReadingProgress("article");

const guidePaths = [
  {
    id: "start",
    icon: "i-lucide-play",
    slugs: [],
    titleKey: "readingProgress.roadmap.guide.paths.start.title",
    descriptionKey: "readingProgress.roadmap.guide.paths.start.description",
  },
  {
    id: "song",
    icon: "i-lucide-music-2",
    slugs: ["produccio", "gravacio", "edicio", "mescla"],
    titleKey: "readingProgress.roadmap.guide.paths.song.title",
    descriptionKey: "readingProgress.roadmap.guide.paths.song.description",
  },
  {
    id: "mix",
    icon: "i-lucide-sliders-horizontal",
    slugs: ["mescla", "fonaments"],
    titleKey: "readingProgress.roadmap.guide.paths.mix.title",
    descriptionKey: "readingProgress.roadmap.guide.paths.mix.description",
  },
  {
    id: "theory",
    icon: "i-lucide-piano",
    slugs: ["llenguatge-musical", "harmonia"],
    titleKey: "readingProgress.roadmap.guide.paths.theory.title",
    descriptionKey: "readingProgress.roadmap.guide.paths.theory.description",
  },
  {
    id: "sound",
    icon: "i-lucide-waveform",
    slugs: ["disseny-de-so", "produccio"],
    titleKey: "readingProgress.roadmap.guide.paths.sound.title",
    descriptionKey: "readingProgress.roadmap.guide.paths.sound.description",
  },
];

function normalizeId(id) {
  return String(id || "")
    .trim()
    .toUpperCase();
}

function queryValue(key) {
  const value = route.query[key];
  return Array.isArray(value) ? String(value[0] || "") : String(value || "");
}

function validPathId(value) {
  return guidePaths.some((path) => path.id === value) ? value : "start";
}

const selectedPathId = ref(validPathId(queryValue("path")));
const search = ref(queryValue("q"));
const searchOpen = ref(Boolean(queryValue("q")));

const allNodes = computed(() =>
  [...(roadmap.nodes || [])].sort((a, b) => {
    const seqA = Number.isFinite(a.seq) ? a.seq : 999999;
    const seqB = Number.isFinite(b.seq) ? b.seq : 999999;
    return seqA - seqB || normalizeId(a.id).localeCompare(normalizeId(b.id));
  })
);

const selectedPath = computed(
  () => guidePaths.find((path) => path.id === selectedPathId.value) || guidePaths[0]
);

function nodeSlug(node) {
  return String(node.categorySlug || resourceCategorySlug(node.category));
}

function nodeMatchesPath(node, path) {
  if (!path.slugs.length) return true;
  return path.slugs.includes(nodeSlug(node));
}

function pathNodes(path) {
  return allNodes.value.filter((node) => nodeMatchesPath(node, path));
}

const selectedPathNodes = computed(() => pathNodes(selectedPath.value));

const completedInPath = computed(
  () => selectedPathNodes.value.filter((node) => isNodeRead(node)).length
);

const pathProgress = computed(() => {
  if (!selectedPathNodes.value.length) return 0;
  return Math.round((completedInPath.value / selectedPathNodes.value.length) * 100);
});

const searchResults = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return [];

  return allNodes.value.filter((node) => {
    const haystack = [
      node.id,
      node.title,
      node.category,
      node.module,
      node.objective,
      node.tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
});

const isSearchActive = computed(() => Boolean(search.value.trim()));

const candidateNodes = computed(() => {
  if (isSearchActive.value) return searchResults.value;
  return selectedPathNodes.value;
});

const nextNode = computed(() => {
  return (
    candidateNodes.value.find((node) => !isNodeRead(node)) ||
    candidateNodes.value[0] ||
    null
  );
});

const displayNodes = computed(() => {
  const nodes = candidateNodes.value;
  const pending = nodes.filter((node) => !isNodeRead(node));
  const source = pending.length ? pending : nodes;
  return source.slice(0, 8);
});

const listTitle = computed(() =>
  isSearchActive.value
    ? t("readingProgress.roadmap.guide.searchResults")
    : t("readingProgress.roadmap.guide.listTitle")
);

const listIntro = computed(() =>
  isSearchActive.value
    ? t("readingProgress.roadmap.guide.searchResultsIntro")
    : t("readingProgress.roadmap.guide.listIntro")
);

function categoryLabel(category) {
  return resourceCategoryLabel(category, t);
}

function nodeSummary(node) {
  return String(node.objective || node.module || node.resourceType || "").trim();
}

function resourcePath(node) {
  return localePath(node.path || "/resources");
}

function nodeKey(node) {
  return String(node.path || `/resources/${nodeSlug(node)}/${node.slug || ""}`);
}

function isNodeRead(node) {
  return isRead(nodeKey(node));
}

function pathStats(path) {
  const nodes = pathNodes(path);
  const pending = nodes.filter((node) => !isNodeRead(node)).length;
  return {
    total: nodes.length,
    pending,
  };
}

function selectPath(pathId) {
  selectedPathId.value = validPathId(pathId);
  search.value = "";
  searchOpen.value = false;
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value;
  if (!searchOpen.value) {
    search.value = "";
  }
}

function toggleNode(node) {
  setRead(nodeKey(node), !isNodeRead(node));
}

function confirmReset() {
  if (!import.meta.client || window.confirm(t("readingProgress.roadmap.confirmReset"))) {
    reset(allNodes.value.map((node) => nodeKey(node)));
  }
}

watch(
  () => route.query,
  () => {
    const nextSearch = queryValue("q");
    selectedPathId.value = validPathId(queryValue("path"));
    search.value = nextSearch;
    searchOpen.value = Boolean(nextSearch);
  }
);

watch([selectedPathId, search], () => {
  if (!import.meta.client) return;

  const query = { ...route.query };

  if (selectedPathId.value === "start") {
    delete query.path;
  } else {
    query.path = selectedPathId.value;
  }

  if (search.value.trim()) {
    query.q = search.value.trim();
  } else {
    delete query.q;
  }

  router.replace({ query });
});
</script>

<style scoped>
.page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: var(--text);
}

.guide-hero {
  max-width: 900px;
  margin: 0 0 1.5rem;
}

.eyebrow {
  margin: 0 0 0.45rem;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.guide-hero h1,
.section-head h2,
.study-summary h2,
.next-panel h2,
.empty-panel h2 {
  margin: 0;
  color: var(--text);
  font-weight: 950;
  line-height: 1.04;
}

.guide-hero h1 {
  max-width: 840px;
  font-size: 3.4rem;
  background: linear-gradient(135deg, var(--text) 0%, var(--text) 54%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.guide-hero p:not(.eyebrow) {
  max-width: 780px;
  margin: 1rem 0 0;
  color: var(--text-secondary);
  font-size: 1.08rem;
  line-height: 1.65;
}

.progress-account,
.path-picker,
.study-summary,
.quick-search-panel,
.next-panel,
.empty-panel,
.lesson-section {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-1);
}

.progress-account {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: center;
  margin: 0 0 1.5rem;
  padding: 1.15rem;
}

.account-copy,
.section-head p,
.study-summary p,
.quick-search-panel p,
.search-form small,
.next-panel p,
.empty-panel p,
.lesson-copy span {
  color: var(--text-secondary);
  line-height: 1.55;
}

.account-copy {
  margin: 0;
}

.account-copy strong {
  color: var(--text);
}

.sync-error {
  margin: 0.75rem 0 0;
  color: #fca5a5;
  font-size: 0.92rem;
}

.login-link,
.primary-link,
.ghost-button,
.reset-button,
.lesson-actions a,
.lesson-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 42px;
  border-radius: 999px;
  font: inherit;
  font-weight: 850;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.login-link,
.primary-link {
  padding: 0.75rem 1.1rem;
  border: 1px solid rgba(208, 138, 63, 0.7);
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  color: #0a0a0a;
}

.login-link:hover,
.primary-link:hover,
.ghost-button:hover,
.reset-button:hover,
.lesson-actions a:hover,
.lesson-actions button:hover {
  transform: translateY(-2px);
}

.path-picker {
  padding: 1.25rem;
}

.section-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 470px);
  gap: 1.5rem;
  align-items: end;
  margin: 0 0 1rem;
}

.section-head.compact {
  align-items: start;
}

.section-head h2 {
  font-size: 1.8rem;
}

.section-head p {
  margin: 0;
}

.path-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
}

.path-card {
  min-height: 172px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.8rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.path-card:hover,
.path-card.active {
  transform: translateY(-2px);
  border-color: rgba(208, 138, 63, 0.65);
  background:
    linear-gradient(180deg, rgba(208, 138, 63, 0.12), transparent 70%),
    var(--surface-2);
}

.path-icon {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(208, 138, 63, 0.14);
  color: var(--accent);
}

.path-copy {
  display: grid;
  gap: 0.4rem;
}

.path-copy strong {
  font-size: 1.05rem;
  line-height: 1.2;
}

.path-copy span,
.path-card small {
  color: var(--text-secondary);
  line-height: 1.45;
}

.path-card small {
  font-weight: 800;
}

.study-layout {
  display: grid;
  grid-template-columns: minmax(250px, 330px) minmax(0, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  align-items: start;
}

.study-summary {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.study-summary h2 {
  font-size: 1.7rem;
}

.study-summary p {
  margin: 0;
}

.progress-meter {
  display: grid;
  gap: 0.65rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
}

.progress-meter div:first-child {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.progress-meter strong {
  color: var(--accent);
  font-size: 2rem;
  line-height: 1;
}

.progress-meter span,
.progress-meter small {
  color: var(--text-secondary);
  font-weight: 800;
}

.meter-track {
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

:root[data-theme="light"] .meter-track {
  background: rgba(20, 20, 20, 0.08);
}

.meter-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-dark), var(--accent));
}

.reset-button,
.ghost-button,
.lesson-actions button {
  padding: 0.7rem 1rem;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
}

.study-flow {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.quick-search-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
}

.quick-search-copy h2 {
  margin: 0;
  color: var(--text);
  font-size: 1.45rem;
  line-height: 1.12;
}

.quick-search-copy p:not(.eyebrow) {
  margin: 0.45rem 0 0;
}

.search-toggle {
  white-space: nowrap;
}

.search-form {
  grid-column: 1 / -1;
  display: grid;
  gap: 0.45rem;
  color: var(--text);
  font-weight: 850;
}

.search-box {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.7rem;
  align-items: center;
  min-height: 48px;
  padding: 0 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  font: inherit;
}

.search-form small {
  font-size: 0.92rem;
  font-weight: 500;
}

.next-panel,
.empty-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  padding: 1.25rem;
  background:
    linear-gradient(135deg, rgba(208, 138, 63, 0.16), transparent 58%),
    var(--surface);
}

.next-panel h2,
.empty-panel h2 {
  font-size: 2rem;
}

.next-panel p:not(.eyebrow),
.empty-panel p:not(.eyebrow) {
  margin: 0.6rem 0 0;
}

.lesson-meta,
.lesson-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.85rem;
}

.lesson-meta span,
.lesson-tags small {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  padding: 0.25rem 0.55rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 850;
}

.next-actions {
  display: grid;
  gap: 0.65rem;
  justify-items: stretch;
}

.lesson-section {
  padding: 1.25rem;
}

.lesson-list {
  display: grid;
  gap: 0.75rem;
}

.lesson-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
}

.lesson-card.done {
  border-color: rgba(74, 222, 128, 0.35);
}

.lesson-index {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(208, 138, 63, 0.14);
  color: var(--accent);
  font-weight: 950;
}

.lesson-copy {
  min-width: 0;
}

.lesson-copy p {
  margin: 0 0 0.25rem;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.lesson-copy h3 {
  margin: 0;
  color: var(--text);
  font-size: 1.1rem;
  line-height: 1.24;
}

.lesson-copy span {
  display: block;
  margin-top: 0.35rem;
}

.lesson-actions {
  display: grid;
  gap: 0.5rem;
}

.lesson-actions a {
  padding: 0.65rem 0.9rem;
  border: 1px solid rgba(208, 138, 63, 0.55);
  background: rgba(208, 138, 63, 0.1);
  color: var(--accent);
}

.lesson-actions button {
  min-height: 38px;
  padding: 0.55rem 0.85rem;
  font-size: 0.88rem;
}

.empty-list {
  padding: 2rem;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
}

.empty-list h3 {
  margin: 0 0 0.5rem;
  color: var(--text);
}

.empty-list p {
  margin: 0;
}

@media (max-width: 980px) {
  .path-grid,
  .study-layout,
  .section-head,
  .quick-search-panel,
  .next-panel,
  .empty-panel {
    grid-template-columns: 1fr;
  }

  .study-summary {
    position: static;
  }

  .next-actions {
    justify-items: start;
  }

  .search-toggle {
    justify-self: start;
  }
}

@media (max-width: 720px) {
  .page {
    padding: 3rem 1rem;
  }

  .guide-hero h1 {
    font-size: 2.45rem;
  }

  .progress-account,
  .lesson-card {
    align-items: stretch;
    grid-template-columns: 1fr;
  }

  .progress-account {
    flex-direction: column;
  }

  .path-grid {
    gap: 0.7rem;
  }

  .lesson-actions {
    justify-items: start;
  }
}
</style>
