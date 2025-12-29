<template>
  <ClientOnly>
    <div />
  </ClientOnly>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useCookieConsent } from "../composables/useCookieConsent";

const { isAccepted } = useCookieConsent();

const loadPlausible = () => {
  if (document.getElementById("plausible-script")) return;

  const script = document.createElement("script");
  script.id = "plausible-script";
  script.defer = true;
  script.dataset.domain = "guillemvila.com";
  script.src = "https://plausible.io/js/script.js";
  script.crossOrigin = "anonymous";

  document.head.appendChild(script);
};

watch(
  isAccepted,
  (accepted) => {
    if (accepted) {
      loadPlausible();
    }
  },
  { immediate: true }
);
</script>
