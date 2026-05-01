<template>
  <div class="hud">
    <div class="item">
      <div class="label">{{ t("readingProgress.roadmap.hud.progress") }}</div>
      <div class="value">{{ percent }}%</div>
      <div class="small">{{ completedCount }} / {{ totalCount }}</div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: percent + '%' }" />
      </div>
    </div>

    <div class="item">
      <div class="label">{{ t("readingProgress.roadmap.hud.streak") }}</div>
      <div class="value">{{ streak }}</div>
      <div class="small">{{ t("readingProgress.roadmap.hud.streakDays") }}</div>
    </div>

    <div v-if="estimatedMinutes > 0" class="item">
      <div class="label">{{ t("readingProgress.roadmap.hud.remaining") }}</div>
      <div class="value">{{ formatTime(estimatedMinutes) }}</div>
      <div class="small">{{ t("readingProgress.roadmap.hud.estimated") }}</div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();

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
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 1rem;
  padding: 0 0 1.5rem;
}

.item {
  min-width: 0;
  border-radius: 8px;
  border: 1px solid var(--border);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent),
    var(--surface);
  padding: 1rem;
  box-shadow: var(--shadow-1);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.item:hover {
  transform: translateY(-2px);
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
  font-size: 1.75rem;
  font-weight: 900;
  margin-top: 0.35rem;
  color: var(--accent);
  line-height: 1.1;
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
  content: none;
}

@media (max-width: 900px) {
  .hud {
    grid-template-columns: 1fr;
  }

  .item {
    width: 100%;
  }

  .value {
    font-size: 1.5rem;
  }
}
</style>
