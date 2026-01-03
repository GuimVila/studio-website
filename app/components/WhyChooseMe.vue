<template>
  <section class="section">
    <h2 class="section-title">Per què treballar amb mi?</h2>

    <div class="services-grid">
      <ServiceCard
        v-for="(item, index) in services"
        :key="index"
        :title="item.title"
        :description="item.description"
        :image="item.image"
      />
    </div>
  </section>
</template>

<script setup>
import ServiceCard from "~/components/ServiceCard.vue";

const services = [
  {
    title: "Producció",
    description:
      "Des de la preproducció fins al producte final, t'acompanyo en cada pas del procés creatiu.",
    image: "/images/services/produccio.png",
  },
  {
    title: "Mescla",
    description:
      "Equipament boutique i criteri tècnic per aconseguir un so competitiu i coherent.",
    image: "/images/services/mescla.png",
  },
  {
    title: "Gravació",
    description:
      "Estudi acustitzat i flux de treball pensat per capturar interpretacions reals.",
    image: "/images/services/gravacio.png",
  },
  {
    title: "Recursos",
    description:
      "Recursos i contingut per a músics i productors que volen créixer amb criteri.",
    image: "/images/services/recursos.png",
  },
];
</script>
