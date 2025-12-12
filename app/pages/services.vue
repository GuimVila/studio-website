<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title">Preus i paquets</h1>
      <p class="section-subtitle">
        Trieu el paquet que millor s'adapti a les vostres necessitats
      </p>

      <!-- Mixing & Mastering -->
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in mixingPackages"
          :key="i"
          v-bind="pack"
        />
      </div>

      <!-- Production -->
      <h2 class="section-title section-title-margin">Producció i Gravació</h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in productionPackages"
          :key="i"
          v-bind="pack"
        />
      </div>

      <!-- Volume Discounts -->
      <div class="volume-discounts">
        <h3>Descomptes per volum</h3>
        <p>
          ✓ 10% de descompte a partir de 5 cançons<br >
          ✓ 15% de descompte a partir de 10 cançons (EP/Àlbum)<br >
          ✓ Pressupost personalitzat per projectes grans
        </p>
        <NuxtLink to="/contact" class="btn btn-primary">
          Demanar pressupost
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import PricingCard from "~/components/PricingCard.vue";

const mixingPackages = [
  {
    title: "Mescla",
    price: "80€",
    unit: "/cançó",
    features: [
      "Mescla professional",
      "Fins a 50 pistes",
      "3 revisions incloses",
      "Stems finals",
      "Lliurament en 5-7 dies",
    ],
    link: "/contact",
    button: "Contractar",
    featured: false,
  },
  {
    title: "Mescla + Mastering",
    price: "120€",
    unit: "/cançó",
    features: [
      "Tot el paquet de mescla",
      "Mastering professional",
      "5 revisions totals",
      "Formats optimitzats per streaming",
      "DDP per vinils/CD",
      "Lliurament en 7 dies",
    ],
    link: "/contact",
    button: "Contractar",
    featured: true,
    badge: "MÉS POPULAR",
  },
  {
    title: "Només Mastering",
    price: "50€",
    unit: "/cançó",
    features: [
      "Mastering professional",
      "2 revisions incloses",
      "Formats per streaming i físic",
      "Anàlisi de qualitat",
      "Lliurament en 3-5 dies",
    ],
    link: "/contact",
    button: "Contractar",
    featured: false,
  },
];

const productionPackages = [
  {
    title: "Hora d'Estudi",
    price: "40€",
    unit: "/hora",
    features: [
      "Gravació professional",
      "Enginy de so inclòs",
      "Tot l'equipament disponible",
      "Instruments de l'estudi",
      "Edició bàsica",
    ],
    link: "/contact",
    button: "Reservar",
  },
  {
    title: "Dia Complet",
    price: "280€",
    unit: "/8h",
    features: [
      "8 hores d'estudi",
      "Tot inclòs",
      "Pauses flexibles",
      "Gravació multi-instrument",
      "Edició avançada",
      "Estalvieu 40€",
    ],
    link: "/contact",
    button: "Reservar",
  },
  {
    title: "Producció Completa",
    price: "A mida",
    unit: "",
    features: [
      "Preproducció i arranjaments",
      "Gravació completa",
      "Producció musical",
      "Mescla i mastering",
      "Assessorament continu",
      "Sessions il·limitades",
    ],
    link: "/contact",
    button: "Demanar pressupost",
  },
];
</script>

<style scoped>
.page-wrapper {
  padding-top: 100px;
}
.section {
  text-align: center;
}
.section-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 4rem;
}
.section-title-margin {
  margin-top: 5rem;
}
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}
.volume-discounts {
  background: var(--card-bg);
  padding: 3rem;
  border-radius: 20px;
  margin-top: 5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.volume-discounts h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.volume-discounts p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}
</style>
