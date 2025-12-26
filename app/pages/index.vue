<template>
  <div>
    <AppHero />
    <WhyChooseMe />
    <StartToday />
  </div>
</template>

<script setup>
import AppHero from "~/components/AppHero.vue";
import WhyChooseMe from "~/components/WhyChooseMe.vue";
import StartToday from "~/components/StartToday.vue";

useHead({
  title: "Guillem Vila · Artista, productor musical i enginyer de so",
  meta: [
    {
      name: "description",
      content:
        "Em dic Guillem Vila i sóc artista, productor musical i enginyer de so. Ofereix serveis professionals de gravació, mescla, producció musical i col·laboracions creatives per projectes artístics i musicals.",
    },
  ],
});
</script>
