<template>
  <h1 :id="id">
    <slot />
  </h1>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
  },
});
</script>
