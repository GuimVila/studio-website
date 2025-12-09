<template>
  <section class="section">
    <h2 class="section-title">Per què treballar amb mi?</h2>

    <div class="services-grid">
      <ServiceCard
        v-for="(item, index) in services"
        :key="index"
        :icon="item.icon"
        :title="item.title"
        :description="item.description"
      />
    </div>
  </section>
</template>

<script setup>
import ServiceCard from "~/components/ServiceCard.vue";

const services = [
  {
    icon: "🎛️",
    title: "Producció Professional",
    description:
      "Des de la preproducció fins al producte final, t'acompanyo en cada pas del procés creatiu.",
  },
  {
    icon: "🎚️",
    title: "Mescla i Mastering",
    description:
      "Equipament 'boutique' d'última generació i espai acustitzat per aconseguir el millor so possible.",
  },
  {
    icon: "🎸",
    title: "Gravació",
    description:
      "Estudi complet dissenyat per a gravacions de veu i instruments per pistes.",
  },
  {
    icon: "🎓",
    title: "Blog",
    description:
      "Consells, tutorials i recursos per a músics i productors que volen millorar les seves habilitats.",
  },
];
</script>
