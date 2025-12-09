<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title">Preus i paquets</h1>
      <p class="section-subtitle">
        Trieu el paquet que millor s'adapti a les vostres necessitats
      </p>

      <!-- Mixing & Mastering -->
      <div class="pricing-grid">
        <div
          v-for="(pack, i) in mixingPackages"
          :key="i"
          class="pricing-card"
          :class="{ featured: pack.featured }"
        >
          <div v-if="pack.badge" class="badge-popular">{{ pack.badge }}</div>

          <h3>{{ pack.title }}</h3>

          <div class="price">
            {{ pack.price }}<span class="price-unit">{{ pack.unit }}</span>
          </div>

          <ul class="pricing-features">
            <li v-for="(feature, j) in pack.features" :key="j">
              {{ feature }}
            </li>
          </ul>

          <NuxtLink
            :to="pack.link"
            class="btn"
            :class="pack.featured ? 'btn-primary' : 'btn-secondary'"
          >
            {{ pack.button }}
          </NuxtLink>
        </div>
      </div>

      <!-- Production -->
      <h2 class="section-title section-title-margin">Producció i Gravació</h2>

      <div class="pricing-grid">
        <div
          v-for="(pack, i) in productionPackages"
          :key="i"
          class="pricing-card"
        >
          <h3>{{ pack.title }}</h3>

          <div class="price">
            {{ pack.price }}<span class="price-unit">{{ pack.unit }}</span>
          </div>

          <ul class="pricing-features">
            <li v-for="(feature, j) in pack.features" :key="j">
              {{ feature }}
            </li>
          </ul>

          <NuxtLink :to="pack.link" class="btn btn-secondary btn-full">
            {{ pack.button }}
          </NuxtLink>
        </div>
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

/* Pricing Grid */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

/* Cards */
.pricing-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.featured {
  border: 2px solid var(--accent);
}

.badge-popular {
  background: var(--accent);
  color: white;
  padding: 0.5rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  font-weight: bold;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.price-unit {
  font-size: 1rem;
  color: var(--text-secondary);
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  line-height: 1.7;
}

/* Buttons */
.btn-full {
  width: 100%;
  margin-top: 1.5rem;
}

/* Volume Discounts Box */
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
