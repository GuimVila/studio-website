<template>
  <div class="tutorial-card">
    <div class="tutorial-thumbnail">{{ icon }}</div>

    <div class="tutorial-content">
      <span class="tutorial-category">{{ category }}</span>
      <h3 class="tutorial-title">{{ title }}</h3>
      <p class="tutorial-description">{{ description }}</p>

      <div class="tutorial-meta">
        <span>⏱️ {{ duration }}</span>
        <span>📅 {{ date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
})
</script>

