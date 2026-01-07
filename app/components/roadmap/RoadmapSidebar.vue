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
import { onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  open: { type: Boolean, required: true },
  node: { type: Object, default: null },
  completed: { type: Boolean, required: true },
  unlockable: { type: Boolean, required: true },
  isCompleted: { type: Function, required: true },
});

const emit = defineEmits(["close", "toggle-complete", "jump"]);

function handleEscape(e) {
  if (e.key === "Escape") emit("close");
}

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: end;
  animation: fadeIn 0.3s ease;
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
  width: min(720px, 100%);
  height: min(92vh, 900px);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px 20px 0 0;
  padding: 2rem;
  overflow: auto;
  overflow-y: auto;
  scroll-behavior: smooth;
  box-shadow: 0 -10px 60px rgba(0, 0, 0, 0.4);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.header {
  margin-bottom: 2rem;
}

.kicker {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.title {
  margin: 0.75rem 0;
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--text);
  line-height: 1.3;
}

.meta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.pill.locked {
  opacity: 0.6;
}

.pill.done {
  background: rgba(208, 138, 63, 0.15);
  border-color: var(--accent);
  color: var(--accent);
}

.section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 16px;
}

.section h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.section p {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
}

.section p strong {
  color: var(--text);
  font-weight: 700;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.chip {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50px;
  padding: 0.625rem 1rem;
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chip:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.small {
  opacity: 0.7;
  margin-left: 0.5rem;
  font-size: 0.9em;
}

.small.ok {
  opacity: 1;
  color: var(--accent);
}

.footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.status {
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 140px;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
}

.btn:hover {
  background: var(--surface);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-1);
}

.btn.primary {
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  border-color: var(--accent);
  color: white;
}

.btn.primary:hover {
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  color: white;
  box-shadow: var(--accent-shadow-1);
}

.btn.ghost {
  background: transparent;
}

.btn.ghost:hover {
  background: var(--surface-2);
}

.btn[disabled],
.btn[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.btn[disabled]:hover,
.btn[aria-disabled="true"]:hover {
  background: var(--surface-2);
  border-color: var(--border);
  color: var(--text);
  box-shadow: none;
}

.btn.primary[disabled],
.btn.primary[aria-disabled="true"] {
  background: var(--surface-2);
  color: var(--text);
}

@media (max-width: 768px) {
  .panel {
    padding: 1.5rem;
  }

  .buttons {
    flex-direction: column;
  }

  .btn {
    min-width: 0;
  }
}
</style>
