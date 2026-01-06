<template>
  <div class="hud">
    <div class="item">
      <div class="label">Progrés</div>
      <div class="value">{{ percent }}%</div>
      <div class="small">{{ completedCount }} / {{ totalCount }}</div>
    </div>

    <div class="item">
      <div class="label">Streak</div>
      <div class="value">{{ streak }}</div>
      <div class="small">dies seguits</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  completedCount: { type: Number, required: true },
  totalCount: { type: Number, required: true },
  streak: { type: Number, required: true },
});

const percent = computed(() => {
  if (!props.totalCount) return 0;
  return Math.round((props.completedCount / props.totalCount) * 100);
});
</script>

<style scoped>
.hud {
  position: sticky;
  top: 78px; /* per sota dels controls */
  z-index: 15;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}
.item {
  min-width: 140px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  padding: 10px 12px;
  backdrop-filter: blur(10px);
}
.label {
  font-size: 12px;
  opacity: 0.8;
}
.value {
  font-size: 18px;
  margin-top: 6px;
}
.small {
  font-size: 12px;
  opacity: 0.75;
  margin-top: 2px;
}
@media (max-width: 900px) {
  .hud {
    justify-content: stretch;
  }
  .item {
    flex: 1;
  }
}
</style>
