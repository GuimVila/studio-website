<template>
  <section class="controls" :aria-label="t('readingProgress.roadmap.controls.title')">
    <div class="controls-head">
      <div class="controls-copy">
        <p class="controls-kicker">{{ t("readingProgress.roadmap.controls.kicker") }}</p>
        <h2>{{ t("readingProgress.roadmap.controls.title") }}</h2>
        <p>{{ t("readingProgress.roadmap.controls.subtitle") }}</p>
      </div>

      <div v-if="nextTitle" class="next-card">
        <span>{{ t("readingProgress.roadmap.controls.recommended") }}</span>
        <strong>{{ nextTitle }}</strong>
        <small>{{ nextId }}</small>
        <button
          class="next-button"
          type="button"
          :disabled="!nextId"
          @click="emit('next')"
        >
          <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
          {{ t("readingProgress.roadmap.controls.next") }}
        </button>
      </div>
    </div>

    <div class="control-surface">
      <div class="search-row">
        <label class="search-field">
          <span>{{ t("readingProgress.roadmap.controls.search") }}</span>
          <span class="input-shell">
            <UIcon name="i-lucide-search" aria-hidden="true" />
            <input
              type="search"
              inputmode="search"
              autocomplete="off"
              enterkeyhint="go"
              :value="search"
              :placeholder="t('readingProgress.roadmap.controls.searchPlaceholder')"
              @input="onSearchInput"
              @keydown.enter.prevent="nextId && emit('next')"
            >
          </span>
        </label>

        <div class="toggle-stack">
          <label class="toggle-item">
            <span>
              <strong>{{ t("readingProgress.roadmap.controls.focusMode") }}</strong>
              <small>{{ t("readingProgress.roadmap.controls.focusShort") }}</small>
            </span>
            <span class="toggle-switch">
              <input
                type="checkbox"
                :checked="focusMode"
                @change="onFocusChange"
              >
              <span class="slider" />
            </span>
          </label>

          <label class="toggle-item">
            <span>
              <strong>{{ t("readingProgress.roadmap.controls.hideLocked") }}</strong>
              <small>{{ t("readingProgress.roadmap.controls.hideLockedShort") }}</small>
            </span>
            <span class="toggle-switch">
              <input
                type="checkbox"
                :checked="hideLocked"
                @change="onHideLockedChange"
              >
              <span class="slider" />
            </span>
          </label>
        </div>
      </div>

      <div class="category-block">
        <div class="category-label">
          <span>{{ t("readingProgress.roadmap.controls.category") }}</span>
          <small>{{ t("readingProgress.roadmap.controls.categoryHint") }}</small>
        </div>

        <div class="category-strip" role="listbox">
          <button
            class="category-chip"
            type="button"
            :class="{ active: !category }"
            :aria-pressed="!category"
            @click="emit('update:category', '')"
          >
            {{ t("readingProgress.roadmap.controls.allCategories") }}
          </button>
          <button
            v-for="c in categories"
            :key="c"
            class="category-chip"
            type="button"
            :class="{ active: category === c }"
            :aria-pressed="category === c"
            @click="emit('update:category', c)"
          >
            {{ categoryLabel(c) }}
          </button>
        </div>
      </div>

      <div class="controls-foot">
        <p v-if="focusMode" class="focus-help">
          <UIcon name="i-lucide-route" aria-hidden="true" />
          {{ t("readingProgress.roadmap.controls.focusHelp") }}
        </p>
        <p v-else class="focus-help muted">
          <UIcon name="i-lucide-list-filter" aria-hidden="true" />
          {{ t("readingProgress.roadmap.controls.filterHelp") }}
        </p>

        <button
          class="reset-button"
          type="button"
          :title="t('readingProgress.roadmap.controls.reset')"
          @click="emit('reset')"
        >
          <UIcon name="i-lucide-rotate-ccw" aria-hidden="true" />
          {{ t("readingProgress.roadmap.controls.reset") }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { resourceCategoryLabel } from "~/utils/resourceCategories";

defineProps({
  categories: { type: Array, required: true },
  search: { type: String, default: "" },
  category: { type: String, default: "" },
  hideLocked: { type: Boolean, default: false },
  focusMode: { type: Boolean, default: false },
  nextId: { type: String, default: null },
  nextTitle: { type: String, default: null },
});

const emit = defineEmits([
  "reset",
  "next",
  "update:search",
  "update:category",
  "update:hideLocked",
  "update:focusMode",
]);

const { t } = useI18n();

function categoryLabel(category) {
  return resourceCategoryLabel(category, t);
}

function onSearchInput(event) {
  emit("update:search", event.target.value);
}

function onFocusChange(event) {
  emit("update:focusMode", event.target.checked);
}

function onHideLockedChange(event) {
  emit("update:hideLocked", event.target.checked);
}
</script>

<style scoped>
.controls,
.controls * {
  box-sizing: border-box;
}

.controls {
  display: grid;
  gap: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(208, 138, 63, 0.08), transparent 48%),
    var(--surface);
  box-shadow: var(--shadow-1);
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.controls-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 1rem;
  align-items: stretch;
  padding: 1.25rem 1.25rem 0;
  min-width: 0;
}

.controls-copy {
  min-width: 0;
}

.controls-kicker,
.category-label span {
  display: block;
  margin: 0 0 0.35rem;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.controls-copy h2 {
  margin-bottom: 0;
  font-size: 1.55rem;
  line-height: 1.12;
  color: var(--text);
}

.controls-copy p:not(.controls-kicker) {
  max-width: 64ch;
  margin: 0.55rem 0 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.next-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "label button"
    "title button"
    "id    button";
  gap: 0.2rem 0.85rem;
  align-items: center;
  padding: 0.95rem;
  border: 1px solid rgba(208, 138, 63, 0.32);
  border-radius: 8px;
  background: rgba(208, 138, 63, 0.08);
  min-width: 0;
}

.next-card span {
  grid-area: label;
  color: var(--accent);
  font-size: 0.76rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.next-card strong {
  grid-area: title;
  color: var(--text);
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.next-card small {
  grid-area: id;
  color: var(--text-secondary);
  font-weight: 800;
}

.next-button {
  grid-area: button;
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0.75rem 0.9rem;
  border: 1px solid rgba(208, 138, 63, 0.5);
  border-radius: 8px;
  background: var(--accent);
  color: #0a0a0a;
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.next-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--accent-shadow-1);
}

.next-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.control-surface {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.search-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.65fr);
  gap: 1rem;
  align-items: stretch;
  min-width: 0;
}

.search-field {
  display: grid;
  gap: 0.55rem;
  min-width: 0;
}

.search-field > span:first-child {
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 800;
}

.input-shell {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
}

.input-shell :deep(svg) {
  position: absolute;
  left: 0.95rem;
  width: 18px;
  height: 18px;
  color: var(--accent);
  pointer-events: none;
}

input[type="search"],
select {
  width: 100%;
  max-width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.88rem 1rem;
  color: var(--text);
  outline: none;
  font-family: inherit;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  padding-left: 2.75rem;
}

input[type="search"]:focus,
select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(208, 138, 63, 0.15);
}

.toggle-stack {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  min-width: 0;
}

.toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  margin: 0;
  padding: 0.85rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text);
  cursor: pointer;
  min-width: 0;
}

.toggle-item strong,
.toggle-item small {
  display: block;
  line-height: 1.25;
}

.toggle-item strong {
  font-size: 0.9rem;
}

.toggle-item small {
  margin-top: 0.15rem;
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--surface-2);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background: var(--text-secondary);
  transition: all 0.3s ease;
  border-radius: 50%;
}

.toggle-switch input:checked + .slider {
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  border-color: var(--accent);
}

.toggle-switch input:checked + .slider:before {
  transform: translateX(20px);
  background: white;
}

.toggle-switch input:focus + .slider {
  box-shadow: 0 0 0 3px rgba(208, 138, 63, 0.15);
}

.category-block {
  display: grid;
  gap: 0.65rem;
}

.category-label {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  justify-content: space-between;
}

.category-label span {
  margin: 0;
}

.category-label small {
  color: var(--text-secondary);
  font-size: 0.84rem;
}

.category-strip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.15rem;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}

.category-chip {
  flex: 0 0 auto;
  min-height: 38px;
  padding: 0.62rem 0.82rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-secondary);
  font-weight: 850;
  cursor: pointer;
  scroll-snap-align: start;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.category-chip:hover {
  transform: translateY(-1px);
  border-color: rgba(208, 138, 63, 0.45);
  color: var(--text);
}

.category-chip.active {
  background: rgba(208, 138, 63, 0.16);
  border: 1px solid var(--accent);
  color: var(--accent);
}

.controls-foot {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border);
  padding-top: 1rem;
}

.focus-help {
  display: inline-flex;
  gap: 0.55rem;
  align-items: center;
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.4;
  font-size: 0.92rem;
}

.focus-help :deep(svg) {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  color: var(--accent);
}

.focus-help.muted :deep(svg) {
  color: var(--text-secondary);
}

.reset-button {
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 850;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.reset-button:hover {
  border-color: rgba(248, 113, 113, 0.55);
  background: rgba(248, 113, 113, 0.08);
  color: #fca5a5;
}

@media (max-width: 900px) {
  .controls-head,
  .search-row {
    grid-template-columns: 1fr;
  }

  .controls-head,
  .control-surface {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .toggle-stack {
    grid-template-columns: 1fr;
  }

  .next-card {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "label"
      "title"
      "id"
      "button";
  }

  .next-button {
    width: 100%;
    margin-top: 0.45rem;
  }

  .category-label,
  .controls-foot {
    align-items: flex-start;
    flex-direction: column;
  }

  .reset-button {
    width: 100%;
  }
}
</style>
