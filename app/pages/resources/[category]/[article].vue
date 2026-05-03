<template>
  <article class="page">
    <section class="section">
      <h1 class="section-title heading-accent">{{ doc.title }}</h1>

      <button class="back" type="button" @click="goBack">
        {{ $t("resourcesHub.back") }}
      </button>

      <div class="article-progress">
        <div>
          <p class="eyebrow">
            {{
              articleIsRead
                ? $t("readingProgress.states.read")
                : $t("readingProgress.states.pending")
            }}
          </p>
          <p class="progress-copy">
            {{
              userStore.isLoggedIn
                ? isSyncing
                  ? $t("readingProgress.common.syncing")
                  : $t("readingProgress.common.account")
                : $t("readingProgress.common.local")
            }}
          </p>
          <p v-if="syncError" class="sync-error">{{ syncError }}</p>
        </div>

        <div class="progress-actions">
          <button class="progress-button" type="button" @click="toggleRead">
            {{
              articleIsRead
                ? $t("readingProgress.article.markPending")
                : $t("readingProgress.article.markRead")
            }}
          </button>
          <NuxtLink
            v-if="!userStore.isLoggedIn"
            class="progress-link"
            :to="loginLink"
          >
            {{ $t("readingProgress.common.login") }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- IMPORTANT: només encapsulem el markdown -->
    <div class="prose">
      <ContentRenderer :value="doc" />
    </div>

    <section v-if="recommendedArticles.length" class="continue-panel">
      <p class="eyebrow">{{ $t("readingProgress.article.continueKicker") }}</p>
      <h2>{{ $t("readingProgress.article.continueTitle") }}</h2>
      <p>{{ $t("readingProgress.article.continueIntro") }}</p>

      <div class="continue-list">
        <NuxtLink
          v-for="node in recommendedArticles"
          :key="node.id"
          class="continue-card"
          :to="resourceNodePath(node)"
        >
          <span>{{ node.id }} · {{ roadmapCategoryLabel(node.category) }}</span>
          <strong>{{ node.title }}</strong>
          <small>{{ node.module }}</small>
        </NuxtLink>
      </div>

      <NuxtLink class="guide-link" :to="localePath('/resources/roadmap')">
        {{ $t("readingProgress.article.openGuide") }}
        <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
      </NuxtLink>
    </section>
  </article>
</template>

<script setup>
import { resourceCategoryLabel } from "~/utils/resourceCategories";
import roadmap from "../../../../data/roadmap.json";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const localePath = useLocalePath();
const { t } = useI18n();

const category = String(route.params.category || "").trim();
const article = String(route.params.article || "").trim();

const contentPath = `/resources/${category}/${article}`;
const {
  isRead,
  setRead,
  isSyncing,
  syncError,
} = useReadingProgress("article");

const articleIsRead = computed(() => isRead(contentPath));

const loginLink = computed(() => ({
  path: localePath("/login"),
  query: { redirect: route.fullPath },
}));

function goBack() {
  if (import.meta.client && window.history.state?.back) {
    router.back();
    return;
  }

  navigateTo(localePath(`/resources/${category}`));
}

function toggleRead() {
  setRead(contentPath, !articleIsRead.value);
}

const { data: doc } = await useAsyncData(
  () => `resources-doc-${contentPath}`,
  async () => {
    return await queryCollection("resources").path(contentPath).first();
  }
);

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: "Not found" });
}

const roadmapNodes = computed(() =>
  [...(roadmap.nodes || [])].sort((a, b) => {
    const seqA = Number.isFinite(a.seq) ? a.seq : 999999;
    const seqB = Number.isFinite(b.seq) ? b.seq : 999999;
    return seqA - seqB || String(a.id).localeCompare(String(b.id));
  })
);

const currentRoadmapNode = computed(() =>
  roadmapNodes.value.find((node) => String(node.path || "") === contentPath)
);

const recommendedArticles = computed(() => {
  const current = currentRoadmapNode.value;
  if (!current) return [];

  const afterCurrent = roadmapNodes.value.filter((node) => {
    if (String(node.id) === String(current.id)) return false;
    return Number(node.seq || 0) > Number(current.seq || 0);
  });

  const sameModule = afterCurrent.filter(
    (node) => node.category === current.category && node.module === current.module
  );
  const sameCategory = afterCurrent.filter(
    (node) => node.category === current.category && node.module !== current.module
  );

  const unique = new Map();
  for (const node of [...sameModule, ...sameCategory]) {
    unique.set(String(node.id), node);
  }

  return Array.from(unique.values()).slice(0, 3);
});

function resourceNodePath(node) {
  return localePath(node.path || "/resources/roadmap");
}

function roadmapCategoryLabel(category) {
  return resourceCategoryLabel(category, t);
}
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 2rem;
  color: var(--text);
}

/* Botó enrere: no el centrem ni el movem del teu layout */
.back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  margin-top: 1rem; /* sota el títol */
  padding: 0.75rem 1.5rem;

  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50px;

  color: var(--text);
  font: inherit;
  font-weight: 500;
  cursor: pointer;

  text-decoration: none !important; /* blinda contra styles del markdown i globals */
  transition:
    transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 220ms ease,
    background 220ms ease,
    color 220ms ease,
    box-shadow 220ms ease;
}

.back:hover,
.back:focus,
.back:focus-visible,
.back:active {
  text-decoration: none !important;
}

.back:hover {
  background: var(--surface-2);
  border-color: rgba(208, 138, 63, 0.55);
  color: var(--accent);
  transform: translate3d(-2px, 0, 0); /* suau */
  box-shadow: var(--shadow-1);
}

.article-progress {
  margin: 1.5rem auto 0;
  max-width: 760px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow-1);
  text-align: left;
}

.eyebrow {
  margin: 0 0 0.25rem;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.progress-copy {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.sync-error {
  margin: 0.5rem 0 0;
  color: #fca5a5;
  font-size: 0.9rem;
}

.progress-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.progress-button,
.progress-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.progress-button {
  border: 1px solid rgba(208, 138, 63, 0.7);
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  color: #fff;
}

.progress-link {
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  text-decoration: none;
}

.progress-button:hover,
.progress-link:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}

/* Wrapper del markdown */
.prose {
  margin-top: 1.5rem;
}

.continue-panel {
  margin-top: 3rem;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  box-shadow: var(--shadow-1);
}

.continue-panel h2 {
  margin: 0;
  color: var(--text);
  font-size: 1.8rem;
  line-height: 1.15;
}

.continue-panel > p:not(.eyebrow) {
  margin: 0.65rem 0 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.continue-list {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.continue-card {
  display: grid;
  gap: 0.3rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-2);
  color: var(--text);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.continue-card:hover {
  transform: translateY(-2px);
  border-color: rgba(208, 138, 63, 0.58);
}

.continue-card span {
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.continue-card strong {
  color: var(--text);
  font-size: 1.05rem;
  line-height: 1.25;
}

.continue-card small {
  color: var(--text-secondary);
}

.guide-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 42px;
  margin-top: 1rem;
  padding: 0.7rem 1rem;
  border: 1px solid rgba(208, 138, 63, 0.62);
  border-radius: 999px;
  background: rgba(208, 138, 63, 0.1);
  color: var(--accent);
  font-weight: 850;
  text-decoration: none;
}

/* Estils del contingut: ARA només afecten el markdown */
.prose :deep(h2) {
  font-size: 1.8rem;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: var(--text);
}

.prose :deep(h3) {
  font-size: 1.4rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--text);
}

.prose :deep(p) {
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
}

.prose :deep(code) {
  background: var(--surface);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.9em;
  border: 1px solid var(--border);
}

.prose :deep(pre) {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.prose :deep(pre code) {
  background: none;
  padding: 0;
  border: none;
}

.prose :deep(blockquote) {
  border-left: 4px solid var(--accent);
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: var(--text-secondary);
}

.prose :deep(strong) {
  color: var(--text);
  font-weight: 700;
}

.prose :deep(a) {
  color: var(--accent);
  text-decoration: none;
  transition:
    color 0.2s ease,
    text-decoration-color 0.2s ease;
}

.prose :deep(a:hover) {
  color: var(--accent-light);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 768px) {
  .page {
    padding: 4rem 1.5rem;
  }

  .article-progress {
    align-items: stretch;
    flex-direction: column;
  }

  .progress-actions {
    justify-content: flex-start;
  }
}
</style>
