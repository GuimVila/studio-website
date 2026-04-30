<template>
  <section class="page">
    <section class="section">
      <h1 class="section-title heading-accent capitalize">
        {{ categoryLabelText }}
      </h1>
      <NuxtLink class="back" :to="localePath('/resources')">
        {{ $t("resourcesHub.back") }}
      </NuxtLink>
    </section>

    <section class="progress-strip">
      <div>
        <p class="eyebrow">{{ $t("readingProgress.category.title") }}</p>
        <p class="progress-copy">
          {{
            $t("readingProgress.category.summary", {
              read: readCount,
              total: articles.length,
            })
          }}
          {{ isSyncing ? $t("readingProgress.common.syncing") : "" }}
        </p>
        <p v-if="syncError" class="sync-error">{{ syncError }}</p>
      </div>

      <div class="progress-actions">
        <button
          class="progress-button secondary"
          type="button"
          :disabled="readCount === 0"
          @click="confirmResetCategory"
        >
          {{ $t("readingProgress.category.reset") }}
        </button>
        <NuxtLink
          v-if="!userStore.isLoggedIn"
          class="progress-link"
          :to="{ path: localePath('/login'), query: { redirect: route.fullPath } }"
        >
          {{ $t("readingProgress.common.login") }}
        </NuxtLink>
      </div>
    </section>

    <ul class="list">
      <li v-for="a in articles" :key="a.path" :class="{ read: isRead(a.path) }">
        <NuxtLink class="article-link" :to="localePath(a.path)">
          <span>{{ a.title }}</span>
          <span class="state-pill" :class="{ read: isRead(a.path) }">
            {{
              isRead(a.path)
                ? $t("readingProgress.states.read")
                : $t("readingProgress.states.pending")
            }}
          </span>
        </NuxtLink>
        <button
          class="mark-button"
          type="button"
          @click="toggleArticle(a.path)"
        >
          {{
            isRead(a.path)
              ? $t("readingProgress.category.markPending")
              : $t("readingProgress.category.markRead")
          }}
        </button>
      </li>
    </ul>

    <p v-if="!pending && !articles.length" class="empty">
      {{ $t("readingProgress.category.empty") }}
    </p>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { resourceCategoryLabel } from "~/utils/resourceCategories";

const route = useRoute();
const category = computed(() => String(route.params.category || "").trim());
const userStore = useUserStore();
const { t } = useI18n();
const localePath = useLocalePath();
const {
  isRead,
  setRead,
  reset,
  isSyncing,
  syncError,
} = useReadingProgress("article");

const categoryLabelText = computed(() => resourceCategoryLabel(category.value, t));

const {
  data: articles,
  pending,
  refresh,
} = await useAsyncData(
  () => `resources-cat-${category.value}`,
  async () => {
    const prefix = `/resources/${category.value}/`;

    const rows = await queryCollection("resources")
      .where("path", "LIKE", `${prefix}%`)
      .select("title", "path", "seq")
      .all();

    return (rows || []).sort(
      (a, b) => (Number(a.seq) || 999999) - (Number(b.seq) || 999999)
    );
  },
  { default: () => [] }
);

// Fallback robust: si SSR a prod torna buit, força refetch al client
onMounted(() => {
  if (!(articles.value || []).length) refresh();
});

const articlePaths = computed(() => (articles.value || []).map((a) => a.path));

const readCount = computed(
  () => articlePaths.value.filter((path) => isRead(path)).length
);

function toggleArticle(path) {
  setRead(path, !isRead(path));
}

function confirmResetCategory() {
  if (!import.meta.client) {
    reset(articlePaths.value);
    return;
  }

  const ok = window.confirm(
    t("readingProgress.category.confirmReset")
  );

  if (ok) reset(articlePaths.value);
}
</script>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: var(--text);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50px;
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: all 0.25s ease;
}

.back:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateX(-3px);
  text-decoration: none;
}

.progress-strip {
  margin: 0 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-1);
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
.progress-link,
.mark-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    opacity 0.2s ease;
}

.progress-button,
.mark-button {
  border: 1px solid rgba(208, 138, 63, 0.7);
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  color: #fff;
}

.progress-button.secondary {
  background: var(--surface-2);
  color: var(--text);
  border-color: var(--border);
}

.progress-button:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.progress-link {
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  text-decoration: none;
}

.progress-button:not(:disabled):hover,
.progress-link:hover,
.mark-button:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}

.list {
  margin-top: 2rem;
  display: grid;
  gap: 1rem;
  list-style: none;
  padding: 0;
}

.list li {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: all 0.25s ease;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding-right: 1rem;
}

.list li.read {
  border-color: rgba(74, 222, 128, 0.22);
}

.list li:hover {
  transform: translateX(6px);
  border-color: var(--accent);
  box-shadow: var(--shadow-1);
}

.list a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 2rem;
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
}

.list a:hover {
  text-decoration: none;
}

.list a::before {
  content: none;
}

.state-pill {
  flex: 0 0 auto;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 800;
}

.state-pill.read {
  color: #86efac;
  border-color: rgba(74, 222, 128, 0.3);
  background: rgba(74, 222, 128, 0.08);
}

.empty {
  color: var(--text-secondary);
  margin-top: 2rem;
  text-align: center;
  font-size: 1.1rem;
}

/* .capitalize {
  text-transform: capitalize;
} */

@media (max-width: 768px) {
  .page {
    padding: 3rem 1.5rem;
  }

  .progress-strip {
    align-items: stretch;
    flex-direction: column;
  }

  .progress-actions {
    justify-content: flex-start;
  }

  .list li {
    grid-template-columns: 1fr;
    padding: 0;
  }

  .list a {
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
  }

  .mark-button {
    margin: 0 1.25rem 1.25rem;
  }
}
</style>
