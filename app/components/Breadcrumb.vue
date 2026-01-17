<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <NuxtLink
      v-for="(item, i) in items"
      :key="i"
      :to="item.active ? '#' : item.slug ? `/resources/${item.slug}` : '#'"
      :aria-current="item.active ? 'page' : undefined"
      :class="{ disabled: item.active }"
    >
      {{ item.label }}
      <span v-if="i < items.length - 1">/</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every((item) => item.label && (item.slug !== undefined || item.active));
    },
  },
});
</script>

<style scoped>
.breadcrumb {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb a:hover:not(.disabled) {
  color: var(--accent-light);
  text-decoration: underline;
}

.breadcrumb a[aria-current="page"] {
  color: var(--text);
  cursor: default;
  pointer-events: none;
}

.breadcrumb a.disabled {
  color: var(--text);
  cursor: default;
  pointer-events: none;
}
</style>
