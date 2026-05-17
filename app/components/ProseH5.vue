<template>
  <h5 :id="id">
    <slot />
  </h5>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
  },
});
</script>
