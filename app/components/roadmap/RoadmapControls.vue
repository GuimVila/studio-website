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
            :value="search"
            placeholder="ID, tema, mòdul, tags..."
            @input="emit('update:search', $event.target.value)"
            @keydown.enter="nextId && emit('next')"
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
          <span
            class="help-icon"
            title="Mostra només el camí cap al següent node recomanat: els prerequisits necessaris, els nodes completats i els nodes que pots desbloquejar ara. Ignora el filtre de categoria."
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
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

    <div v-if="nextTitle" class="hint" :class="{ 'focus-active': focusMode }">
      <div class="hint-main">
        Següent recomanat: <strong>{{ nextTitle }}</strong>
        <span class="small">({{ nextId }})</span>
      </div>
      <div v-if="focusMode" class="focus-explanation">
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"
          />
        </svg>
        <strong>Mode focus actiu:</strong> només veus els nodes rellevants pel
        teu camí actual (prerequisits, completats i desblocables). El filtre de
        categoria està ignorat.
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

.controls input,
.controls select {
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

.controls input[type="search"] {
  -webkit-appearance: none;
  appearance: none;
}

.controls input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
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

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.35rem;
  color: var(--text-secondary);
  opacity: 0.6;
  cursor: help;
  transition: opacity 0.2s ease;
}

.help-icon:hover {
  opacity: 1;
  color: var(--accent);
}

.hint.focus-active {
  background: linear-gradient(
    135deg,
    rgba(208, 138, 63, 0.08),
    rgba(208, 138, 63, 0.12)
  );
  border-color: var(--accent);
}

.hint-main {
  margin-bottom: 0;
}

.focus-explanation {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(208, 138, 63, 0.25);
  font-size: 0.875rem;
  line-height: 1.5;
}

.focus-explanation .icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
  color: var(--accent);
}

.focus-explanation strong {
  color: var(--accent);
}

@media (max-width: 768px) {
  .controls {
    padding: 1rem;
    border-radius: 18px;
  }

  .row {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }

  .field label {
    font-size: 0.85rem;
    opacity: 0.9;
  }

  .input-wrapper input,
  select {
    border-radius: 14px;
    padding: 0.85rem 1rem;
  }

  .input-wrapper input {
    padding-left: 2.75rem;
  }

  .actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    justify-content: stretch;
  }

  .btn {
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 14px;
  }

  .hint {
    padding: 0.9rem;
    font-size: 0.9rem;
  }

  .focus-explanation {
    font-size: 0.85rem;
  }
}
</style>
