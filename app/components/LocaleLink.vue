<template>
  <NuxtLink :to="localePath(to)" v-bind="$attrs">
    <slot />
  </NuxtLink>
</template>

<script setup>
import { useLocalePath } from "#i18n";

defineOptions({ inheritAttrs: false });

defineProps({
  to: { type: [String, Object], required: true },
});

const localePath = useLocalePath();
</script>
