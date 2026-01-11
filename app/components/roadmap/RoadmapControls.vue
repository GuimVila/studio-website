<template>
  <div class="controls">
    <div class="row">
      <div class="field">
        <label>Cerca</label>
        <div class="input-wrapper">
          <svg
            class="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
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

      <div class="field">
        <label>Categoria</label>
        <select
          :value="category"
          @change="emit('update:category', $event.target.value)"
        >
          <option value="">Totes</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="field inline">
        <label>
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
    </div>

    <div class="row">
      <div class="field">
        <label
          >Zoom
          <span class="zoom-value">{{ Math.round(zoom * 100) }}%</span></label
        >
        <input
          type="range"
          min="0.25"
          max="2"
          step="0.05"
          :value="zoom"
          @input="emit('update:zoom', Number($event.target.value))"
        >
      </div>

      <div class="field inline">
        <label>
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
      </div>

      <div class="actions">
        <button
          class="btn"
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
    </div>

    <div v-if="nextTitle" class="hint">
      Següent recomanat: <strong>{{ nextTitle }}</strong>
      <span class="small">({{ nextId }})</span>
      <span v-if="focusMode" class="small focus-badge">· focus actiu</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true },
  search: { type: String, default: "" },
  category: { type: String, default: "" },
  hideLocked: { type: Boolean, default: false },
  zoom: { type: Number, default: 1 },
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
  "update:zoom",
  "update:focusMode",
]);
</script>

<style scoped>
.controls {
  top: 88px;
  z-index: 20;
  backdrop-filter: blur(12px);
  background: var(--header-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: var(--shadow-1);
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

.field.inline label {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  align-items: end;
  flex-wrap: wrap;
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
  margin-top: 1rem;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.hint strong {
  color: var(--accent);
  font-weight: 700;
}

.small {
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
}

@media (max-width: 900px) {
  .controls {
    padding: 1.25rem;
  }

  .row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .actions {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
  }
}
</style>
