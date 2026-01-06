<template>
  <div class="controls">
    <div class="row">
      <div class="field">
        <label>Cerca</label>
        <input
          :value="search"
          placeholder="ID, tema, mòdul, tags..."
          @input="emit('update:search', $event.target.value)"
        >
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
          <input
            type="checkbox"
            :checked="hideLocked"
            @change="emit('update:hideLocked', $event.target.checked)"
          >
          Amaga bloquejats
        </label>
      </div>
    </div>

    <div class="row">
      <div class="field">
        <label>Zoom</label>
        <input
          type="range"
          min="0.7"
          max="1.4"
          step="0.05"
          :value="zoom"
          @input="emit('update:zoom', Number($event.target.value))"
        >
      </div>

      <div class="field inline">
        <label>
          <input
            type="checkbox"
            :checked="focusMode"
            @change="emit('update:focusMode', $event.target.checked)"
          >
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
          Porta’m al següent
        </button>
        <button class="btn" type="button" @click="emit('reset')">
          Reinicia progrés
        </button>
      </div>
    </div>

    <div v-if="nextTitle" class="hint">
      Següent recomanat: <strong>{{ nextTitle }}</strong>
      <span class="small">({{ nextId }})</span>
      <span v-if="focusMode" class="small">· focus actiu</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
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

const {
  categories,
  search,
  category,
  hideLocked,
  zoom,
  focusMode,
  nextId,
  nextTitle,
} = toRefs(props);
</script>

<style scoped>
.controls {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(10px);
  background: color-mix(in oklab, #0b1220 75%, transparent);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px;
}
.row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 12px;
  align-items: end;
  margin-bottom: 10px;
}
.field label {
  display: block;
  font-size: 12px;
  opacity: 0.85;
  margin-bottom: 6px;
}
.field.inline label {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 0;
}
input,
select {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 12px;
  color: white;
  outline: none;
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: end;
  flex-wrap: wrap;
}
.btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 10px 12px;
  color: white;
  cursor: pointer;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.12);
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.hint {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.85;
}
.small {
  opacity: 0.75;
}
@media (max-width: 900px) {
  .row {
    grid-template-columns: 1fr;
  }
  .actions {
    justify-content: stretch;
  }
}
</style>
