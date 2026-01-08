<template>
  <div class="hud">
    <div class="item">
      <div class="label">Progrés</div>
      <div class="value">{{ percent }}%</div>
      <div class="small">{{ completedCount }} / {{ totalCount }}</div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: percent + '%' }"/>
      </div>
    </div>

    <div class="item">
      <div class="label">Streak</div>
      <div class="value">{{ streak }}</div>
      <div class="small">dies seguits</div>
    </div>

    <div v-if="estimatedMinutes > 0" class="item">
      <div class="label">Temps restant</div>
      <div class="value">{{ formatTime(estimatedMinutes) }}</div>
      <div class="small">estimat</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  completedCount: { type: Number, required: true },
  totalCount: { type: Number, required: true },
  streak: { type: Number, required: true },
  estimatedMinutes: { type: Number, default: 0 },
});

const percent = computed(() => {
  if (!props.totalCount) return 0;
  return Math.round((props.completedCount / props.totalCount) * 100);
});

function formatTime(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
</script>

<style scoped>
.hud {
  top: calc(88px + 8rem);
  z-index: 15;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.item {
  min-width: 160px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 1.25rem 1.5rem;
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-1);
  transition: all 0.3s ease;
}

.item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-2);
  border-color: var(--accent);
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 2rem;
  font-weight: 900;
  margin-top: 0.5rem;
  color: var(--accent);
}

.small {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.progress-bar {
  margin-top: 0.75rem;
  height: 6px;
  background: var(--surface-2);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-dark), var(--accent));
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 900px) {
  .hud {
    justify-content: stretch;
    gap: 0.75rem;
  }

  .item {
    flex: 1;
    min-width: 0;
    padding: 1rem;
  }

  .value {
    font-size: 1.5rem;
  }
}
</style>
