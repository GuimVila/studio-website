<template>
  <h6 :id="id">
    <slot />
  </h6>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
  },
});
</script>
