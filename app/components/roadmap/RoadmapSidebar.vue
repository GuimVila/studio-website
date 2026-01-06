<template>
  <div v-if="open" class="overlay" @click.self="emit('close')">
    <aside class="panel">
      <div class="header">
        <div class="kicker">{{ node?.category }} · {{ node?.module }}</div>
        <h2 class="title">{{ node?.title }}</h2>
        <div class="meta">
          <span class="pill">ID: {{ node?.id }}</span>
          <span v-if="node?.resourceType" class="pill">{{
            node?.resourceType
          }}</span>
          <span v-if="node?.estMinutes" class="pill"
            >~{{ node?.estMinutes }} min</span
          >
        </div>
      </div>

      <div v-if="node?.objective" class="section">
        <h3>Objectiu</h3>
        <p>{{ node.objective }}</p>
      </div>

      <div v-if="node?.prereqIds?.length" class="section">
        <h3>Prerequisits</h3>
        <div class="chips">
          <button
            v-for="p in node.prereqIds"
            :key="p"
            class="chip"
            type="button"
            @click="emit('jump', p)"
          >
            {{ p }}
            <span class="small" :class="{ ok: isCompleted(p) }">
              {{ isCompleted(p) ? "✓" : "·" }}
            </span>
          </button>
        </div>
      </div>

      <div v-if="node?.exercise" class="section">
        <h3>Deliverable / exercici</h3>
        <p>{{ node.exercise }}</p>
      </div>

      <div v-if="node?.measurable" class="section">
        <h3>Resultat mesurable</h3>
        <p>{{ node.measurable }}</p>
      </div>

      <div v-if="node?.monetization || node?.cta" class="section">
        <h3>Valor (per tu)</h3>
        <p v-if="node?.monetization">
          <strong>Monetització:</strong> {{ node.monetization }}
        </p>
        <p v-if="node?.cta"><strong>CTA:</strong> {{ node.cta }}</p>
      </div>

      <div class="footer">
        <div class="status">
          <span class="pill" :class="{ locked: !unlockable, done: completed }">
            {{
              completed ? "Completat" : unlockable ? "Disponible" : "Bloquejat"
            }}
          </span>
        </div>

        <div class="buttons">
          <NuxtLink
            v-if="node"
            class="btn primary"
            :to="node.path"
            :aria-disabled="!unlockable"
          >
            Obre l’article
          </NuxtLink>

          <button
            class="btn"
            type="button"
            :disabled="!unlockable"
            @click="emit('toggle-complete')"
          >
            {{ completed ? "Marca com pendent" : "Marca com fet" }}
          </button>

          <button class="btn ghost" type="button" @click="emit('close')">
            Tanca
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  open: { type: Boolean, required: true },
  node: { type: Object, default: null },
  completed: { type: Boolean, required: true },
  unlockable: { type: Boolean, required: true },
  isCompleted: { type: Function, required: true },
});

const emit = defineEmits(["close", "toggle-complete", "jump"]);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: end;
}
.panel {
  width: min(720px, 100%);
  height: min(92vh, 900px);
  background: #0b1220;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px 20px 0 0;
  padding: 18px;
  overflow: auto;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
}
.kicker {
  font-size: 12px;
  opacity: 0.8;
}
.title {
  margin: 8px 0 8px;
  font-size: 22px;
}
.meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
}
.pill.locked {
  opacity: 0.7;
}
.pill.done {
  background: rgba(255, 255, 255, 0.1);
}
.section {
  margin-top: 14px;
}
.section h3 {
  font-size: 13px;
  margin-bottom: 8px;
  opacity: 0.9;
}
.section p {
  opacity: 0.92;
  line-height: 1.5;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 8px 10px;
  color: white;
  cursor: pointer;
}
.small {
  opacity: 0.7;
  margin-left: 6px;
}
.small.ok {
  opacity: 1;
}
.footer {
  margin-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 14px;
}
.buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.btn {
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  cursor: pointer;
  text-decoration: none;
}
.btn.primary {
  background: rgba(255, 255, 255, 0.12);
}
.btn.ghost {
  background: transparent;
}
.btn[disabled],
.btn[aria-disabled="true"] {
  opacity: 0.55;
  pointer-events: none;
}
</style>
