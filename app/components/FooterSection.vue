<template>
  <div class="footer-section">
    <h4 class="footer-title">{{ title }}</h4>
    <slot />
  </div>
</template>

<script setup>
defineProps({ title: { type: String, required: true } });
</script>

<style scoped>
.footer-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
}
</style>
