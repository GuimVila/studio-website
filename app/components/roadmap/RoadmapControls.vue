<template>
  <div class="controls">
    <div class="controls-grid">
      <!-- Cerca -->
      <div class="field area-search">
        <label>Cerca</label>
        <div class="input-wrapper">
          <!-- icon + input igual -->

          <input
            type="search"
            inputmode="search"
            autocomplete="off"
            enterkeyhint="go"
            :value="search"
            placeholder="ID, tema, mòdul, tags..."
            @input="emit('update:search', $event.target.value)"
            @keydown.enter.prevent="nextId && emit('next')"
          >
        </div>
      </div>

      <!-- Categoria -->
      <div class="field area-category">
        <label>Categoria</label>
        <select
          :value="category"
          @change="emit('update:category', $event.target.value)"
        >
          <option value="">Totes</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="field area-focus">
        <div class="toggles">
          <label class="toggle-item">
            <span class="toggle-switch">
              <input
                type="checkbox"
                :checked="focusMode"
                @change="emit('update:focusMode', $event.target.checked)"
              >
              <span class="slider" />
            </span>
            Mode focus
          </label>

          <label class="toggle-item">
            <span class="toggle-switch">
              <input
                type="checkbox"
                :checked="hideLocked"
                @change="emit('update:hideLocked', $event.target.checked)"
              >
              <span class="slider" />
            </span>
            Amaga bloquejats
          </label>
        </div>

        <div v-if="focusMode" class="focus-help">
          Mode focus activat: només veuràs els nodes rellevants per arribar al
          “següent recomanat”.
        </div>
      </div>

      <!-- Accions -->
      <div class="actions area-actions">
        <button
          class="btn primary"
          type="button"
          :disabled="!nextId"
          @click="emit('next')"
        >
          Porta'm al següent
        </button>
        <button class="btn" type="button" @click="emit('reset')">
          Reinicia progrés
        </button>
      </div>

      <!-- Hint següent recomanat -->
      <div v-if="nextTitle" class="hint area-hint">
        Següent recomanat: <strong>{{ nextTitle }}</strong>
        <span class="small"> ({{ nextId }})</span>
        <span v-if="focusMode" class="small focus-badge">* Focus actiu</span>
      </div>
    </div>
  </div>
</template>

<script setup>
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
</script>

<style scoped>
.controls {
  z-index: 20;
  backdrop-filter: blur(12px);
  background: var(--header-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: var(--shadow-1);
}

.controls-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1.4fr 1fr 1fr 260px;
  grid-template-areas:
    "search   category category actions"
    "focus    focus    focus    actions"
    "hint     hint     hint     hint";
  align-items: end;
}

.area-search {
  grid-area: search;
}
.area-category {
  grid-area: category;
}
.area-hide {
  grid-area: hide;
}
.area-focus {
  grid-area: focus;
}
.area-actions {
  grid-area: actions;
}
.area-hint {
  grid-area: hint;
}
.row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
}

.row:last-of-type {
  margin-bottom: 0;
}

.field label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.field.inline label {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0;
  cursor: pointer;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
  z-index: 1;
}

input[type="text"],
input[type="search"],
select {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: var(--text);
  outline: none;
  font-family: inherit;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.input-wrapper input {
  padding-left: 2.75rem;
}

input[type="text"]:focus,
input[type="search"]:focus,
select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(208, 138, 63, 0.15);
}

.zoom-value {
  float: right;
  color: var(--accent);
  font-weight: 700;
}

input[type="range"] {
  width: 100%;
  height: 6px;
  background: var(--surface);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  transition: transform 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: none;
  transition: transform 0.2s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.toggles {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  flex-wrap: wrap;
}

.toggle-item {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0; 
  padding: 0; 
  line-height: 1;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
}

.toggle-item .toggle-switch {
  transform: translateY(1px); /* micro-ajust (si cal) */
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  margin-right: 1rem;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.inline-label {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.focus-help {
  border: 1px solid rgba(208, 138, 63, 0.35);
  background: rgba(208, 138, 63, 0.08);
  color: var(--text-secondary);
  border-radius: 12px;
  padding: 0.75rem 0.9rem;
  line-height: 1.4;
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

.field.inline label {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.actions {
  display: grid;
  gap: 0.75rem;
  align-items: start;
}

.btn {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-1);
}

.btn.primary {
  border-color: rgba(208, 138, 63, 0.45);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.btn:disabled:hover {
  background: var(--surface);
  border-color: var(--border);
  color: var(--text);
  box-shadow: none;
}

.hint {
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.hint strong {
  color: var(--accent);
  font-weight: 700;
}

.small {
  margin-left: 1rem;
  opacity: 0.7;
  font-size: 0.9em;
}

.focus-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  background: rgba(208, 138, 63, 0.15);
  border: 1px solid var(--accent);
  border-radius: 12px;
  color: var(--accent);
  font-weight: 600;
  opacity: 1;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .controls {
    padding: 1.1rem;
  }

  .toggles {
    gap: 0.9rem;
  }

  .controls-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "search"
      "category"
      "hide"
      "focus"
      "actions"
      "hint";
    align-items: stretch;
  }

  .hint {
    margin-top: 1rem;
    padding: 1.1rem;
  }

  .focus-help {
    padding: 1rem;
    font-size: 0.95rem;
  }

  .row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .actions {
    grid-template-columns: 1fr 1fr;
  }

  .btn {
    flex: 1;
    width: 100%;
  }

  .focus-badge {
    flex-basis: 100%;
    width: 100%;
    justify-content: center;
  }
}
</style>
