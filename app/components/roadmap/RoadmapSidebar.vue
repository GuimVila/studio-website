<template>
  <div v-if="open" class="overlay" @click.self="emit('close')">
    <aside class="panel" role="dialog" aria-modal="true">
      <header class="panel-header">
        <button
          class="close-button"
          type="button"
          :title="t('readingProgress.roadmap.sidebar.close')"
          @click="emit('close')"
        >
          <UIcon name="i-lucide-x" aria-hidden="true" />
        </button>

        <p class="kicker">{{ categoryLabel(node?.category) }} · {{ node?.module }}</p>
        <h2 class="title">{{ node?.title }}</h2>

        <div class="meta">
          <span class="pill">ID {{ node?.id }}</span>
          <span v-if="node?.resourceType" class="pill">{{ node?.resourceType }}</span>
          <span v-if="node?.estMinutes" class="pill">~{{ node?.estMinutes }} min</span>
        </div>

        <div class="status-card" :class="statusClass">
          <span class="status-icon">
            <UIcon :name="statusIcon" aria-hidden="true" />
          </span>
          <div>
            <strong>{{ statusLabel }}</strong>
            <p>{{ statusText }}</p>
          </div>
        </div>
      </header>

      <div class="panel-body">
        <section
          v-for="item in detailItems"
          :key="item.key"
          class="section"
        >
          <div class="section-icon">
            <UIcon :name="item.icon" aria-hidden="true" />
          </div>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.value }}</p>
          </div>
        </section>

        <section v-if="node?.prereqIds?.length" class="section prereq-section">
          <div class="section-icon">
            <UIcon name="i-lucide-git-branch" aria-hidden="true" />
          </div>
          <div>
            <h3>{{ t("readingProgress.roadmap.sidebar.prerequisites") }}</h3>
            <div class="chips">
              <button
                v-for="p in node.prereqIds"
                :key="p"
                class="chip"
                type="button"
                :class="{ done: isCompleted(p) }"
                @click="emit('jump', p)"
              >
                <span>{{ p }}</span>
                <UIcon
                  :name="isCompleted(p) ? 'i-lucide-check' : 'i-lucide-circle'"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </section>

        <section v-if="node?.monetization || node?.cta" class="section value-section">
          <div class="section-icon">
            <UIcon name="i-lucide-sparkles" aria-hidden="true" />
          </div>
          <div>
            <h3>{{ t("readingProgress.roadmap.sidebar.value") }}</h3>
            <p v-if="node?.monetization">
              <strong>{{ t("readingProgress.roadmap.sidebar.monetization") }}:</strong>
              {{ node.monetization }}
            </p>
            <p v-if="node?.cta">
              <strong>{{ t("readingProgress.roadmap.sidebar.cta") }}:</strong>
              {{ node.cta }}
            </p>
          </div>
        </section>
      </div>

      <footer class="action-bar">
        <NuxtLink
          v-if="node && unlockable"
          class="btn primary"
          :to="localePath(normalizeResourcePath(node.path))"
        >
          <UIcon name="i-lucide-book-open" aria-hidden="true" />
          {{ t("readingProgress.roadmap.sidebar.openArticle") }}
        </NuxtLink>

        <button
          v-else
          class="btn primary"
          type="button"
          disabled
        >
          <UIcon name="i-lucide-lock" aria-hidden="true" />
          {{ t("readingProgress.roadmap.sidebar.openArticle") }}
        </button>

        <button
          class="btn"
          type="button"
          :disabled="!unlockable"
          @click="emit('toggle-complete')"
        >
          <UIcon
            :name="completed ? 'i-lucide-undo-2' : 'i-lucide-check'"
            aria-hidden="true"
          />
          {{
            completed
              ? t("readingProgress.roadmap.sidebar.markPending")
              : t("readingProgress.roadmap.sidebar.markDone")
          }}
        </button>

        <button class="btn ghost" type="button" @click="emit('close')">
          {{ t("readingProgress.roadmap.sidebar.close") }}
        </button>
      </footer>
    </aside>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from "vue";
import { resourceCategoryLabel } from "~/utils/resourceCategories";
import { normalizeResourcePath } from "~/utils/resourceRoutes";

const props = defineProps({
  open: { type: Boolean, required: true },
  node: { type: Object, default: null },
  completed: { type: Boolean, required: true },
  unlockable: { type: Boolean, required: true },
  isCompleted: { type: Function, required: true },
});

const emit = defineEmits(["close", "toggle-complete", "jump"]);
const localePath = useLocalePath();
const { t } = useI18n();

const detailItems = computed(() =>
  [
    {
      key: "objective",
      icon: "i-lucide-target",
      title: t("readingProgress.roadmap.sidebar.objective"),
      value: props.node?.objective,
    },
    {
      key: "exercise",
      icon: "i-lucide-clipboard-check",
      title: t("readingProgress.roadmap.sidebar.exercise"),
      value: props.node?.exercise,
    },
    {
      key: "measurable",
      icon: "i-lucide-chart-no-axes-column-increasing",
      title: t("readingProgress.roadmap.sidebar.measurable"),
      value: props.node?.measurable,
    },
  ].filter((item) => item.value)
);

const statusClass = computed(() => ({
  done: props.completed,
  available: !props.completed && props.unlockable,
  locked: !props.completed && !props.unlockable,
}));

const statusLabel = computed(() => {
  if (props.completed) return t("readingProgress.roadmap.sidebar.completed");
  if (props.unlockable) return t("readingProgress.roadmap.sidebar.available");
  return t("readingProgress.roadmap.sidebar.locked");
});

const statusIcon = computed(() => {
  if (props.completed) return "i-lucide-check";
  if (props.unlockable) return "i-lucide-play";
  return "i-lucide-lock";
});

const statusText = computed(() => {
  if (props.completed) return t("readingProgress.roadmap.sidebar.completedText");
  if (props.unlockable) return t("readingProgress.roadmap.sidebar.availableText");
  return t("readingProgress.roadmap.sidebar.lockedText");
});

function categoryLabel(category) {
  return resourceCategoryLabel(category, t);
}

function handleEscape(e) {
  if (e.key === "Escape") emit("close");
}

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
});

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }
);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(5px);
  display: grid;
  place-items: stretch end;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.panel {
  width: min(660px, 100%);
  height: 100dvh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  background: var(--surface);
  border-left: 1px solid var(--border);
  overflow: hidden;
  box-shadow: -18px 0 60px rgba(0, 0, 0, 0.38);
  animation: slideIn 0.28s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.panel-header {
  position: relative;
  display: grid;
  gap: 0.95rem;
  padding: 1.4rem;
  border-bottom: 1px solid var(--border);
  background:
    linear-gradient(180deg, rgba(208, 138, 63, 0.1), transparent 62%),
    var(--surface);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.close-button:hover {
  border-color: rgba(208, 138, 63, 0.45);
  background: rgba(208, 138, 63, 0.08);
  color: var(--accent);
}

.kicker {
  max-width: calc(100% - 3rem);
  margin: 0;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0.11em;
  line-height: 1.35;
  text-transform: uppercase;
}

.title {
  max-width: calc(100% - 1.5rem);
  margin: 0;
  color: var(--text);
  font-size: 1.75rem;
  font-weight: 920;
  line-height: 1.12;
}

.meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pill {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text-secondary);
}

.status-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
  padding: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
}

.status-card.done {
  border-color: rgba(208, 138, 63, 0.48);
  background: rgba(208, 138, 63, 0.1);
}

.status-card.available {
  border-color: rgba(110, 168, 254, 0.42);
  background: rgba(110, 168, 254, 0.08);
}

.status-card.locked {
  opacity: 0.75;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--accent);
}

:root[data-theme="light"] .status-icon {
  background: rgba(20, 20, 20, 0.06);
}

.status-card.available .status-icon {
  color: #6ea8fe;
}

.status-card.locked .status-icon {
  color: var(--text-secondary);
}

.status-card strong {
  display: block;
  color: var(--text);
  line-height: 1.2;
}

.status-card p {
  margin: 0.18rem 0 0;
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.4;
}

.panel-body {
  display: grid;
  gap: 0.8rem;
  align-content: start;
  padding: 1rem 1.4rem 1.4rem;
  overflow: auto;
  scroll-behavior: smooth;
}

.section {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.85rem;
  padding: 1rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.section-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(208, 138, 63, 0.1);
  color: var(--accent);
}

.section h3 {
  margin: 0 0 0.45rem;
  color: var(--text);
  font-size: 1rem;
  font-weight: 850;
  line-height: 1.2;
}

.section p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
}

.section p + p {
  margin-top: 0.6rem;
}

.section p strong {
  color: var(--text);
  font-weight: 800;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 34px;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.45rem 0.65rem;
  background: var(--surface);
  color: var(--text-secondary);
  font-weight: 850;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.chip:hover {
  transform: translateY(-1px);
  border-color: rgba(208, 138, 63, 0.45);
  color: var(--text);
}

.chip.done {
  border-color: rgba(208, 138, 63, 0.48);
  color: var(--accent);
}

.action-bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 0.65rem;
  padding: 1rem 1.4rem;
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  border-radius: 8px;
  padding: 0.8rem 0.95rem;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  font-weight: 850;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  border-color: rgba(208, 138, 63, 0.48);
  color: var(--accent);
}

.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0a;
}

.btn.primary:hover {
  color: #0a0a0a;
  box-shadow: var(--accent-shadow-1);
}

.btn.ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn.primary[disabled] {
  background: var(--surface-2);
  border-color: var(--border);
  color: var(--text-secondary);
}

@media (max-width: 760px) {
  .overlay {
    place-items: end stretch;
  }

  .panel {
    width: 100%;
    height: min(92dvh, 820px);
    border-left: 0;
    border-top: 1px solid var(--border);
    border-radius: 8px 8px 0 0;
    animation: slideUp 0.28s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .panel-header,
  .panel-body,
  .action-bar {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .title {
    font-size: 1.42rem;
  }

  .section {
    grid-template-columns: 1fr;
  }

  .section-icon {
    width: 32px;
    height: 32px;
  }

  .action-bar {
    grid-template-columns: 1fr;
  }
}
</style>
