<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title">Serveis i preus</h1>
      <p class="section-subtitle">
        Estudi professional de mescla, producció i gravació. Treball híbrid,
        sala tractada i flux de treball d’alt nivell.
      </p>

      <!-- MIXING -->
      <h2 class="section-title section-title-margin">Mescla</h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in mixingPackages"
          :key="'mix-' + i"
          v-bind="pack"
        />
      </div>

      <!-- TRACKING -->
      <h2 class="section-title section-title-margin">Gravació --
      </h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in trackingPackages"
          :key="'track-' + i"
          v-bind="pack"
        />
      </div>

      <!-- PRODUCTION -->
      <h2 class="section-title section-title-margin">Producció musical</h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in productionPackages"
          :key="'prod-' + i"
          v-bind="pack"
        />
      </div>

      <!-- EDITING -->
      <h2 class="section-title section-title-margin">Edició</h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in editingPackages"
          :key="'edit-' + i"
          v-bind="pack"
        />
      </div>

      <!-- PRO SERVICES -->
      <h2 class="section-title section-title-margin">Altres serveis</h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in proServicePackages"
          :key="'pro-' + i"
          v-bind="pack"
        />
      </div>

      <!-- VOLUME DISCOUNTS -->
      <div class="volume-discounts">
        <h3>Descomptes per volum</h3>
        <p>
          ✓ 10% de descompte a partir de 5 cançons<br >
          ✓ 15% de descompte a partir de 10 cançons (EP / Àlbum)<br >
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

/* =======================
   MIXING
======================= */

const mixingPackages = [
  {
    title: "Mescla bàsica",
    price: "75€",
    unit: "/cançó",
    features: [
      "Mescla professional ITB",
      "Fins a 40 pistes",
      "Automatitzacions bàsiques",
      "2 revisions incloses",
      "Lliurament en 4–6 dies",
    ],
    link: "/contact",
    button: "Contractar",
  },
  {
    title: "Mescla híbrida",
    price: "95€",
    unit: "/cançó",
    features: [
      "Mescla híbrida analògica (Silver Bullet + SSL)",
      "Fins a 60 pistes",
      "Automatitzacions completes",
      "3 revisions incloses",
      "Mix final + instrumental",
      "Lliurament en 5–7 dies",
    ],
    link: "/contact",
    button: "Contractar",
    featured: true,
    badge: "SERVEI PRINCIPAL",
  },
  {
    title: "Mescla avançada",
    price: "120€",
    unit: "/cançó",
    features: [
      "Mescla híbrida analògica (Silver Bullet + SSL)",
      "Sessions complexes (+60 pistes)",
      "Automatitzacions completes",
      "3 revisions incloses",
      "Lliurament en 7–10 dies",
    ],
    link: "/contact",
    button: "Contractar",
  },
];

/* =======================
   TRACKING
======================= */

const trackingPackages = [
  {
    title: "Gravació d’instruments",
    price: "40€",
    unit: "/hora",
    features: [
      "Instruments elèctrics, acústics i overdubs",
      "Suhr Reactive Load",
      "Captura DI + amp",
      "Enginyer inclòs",
      "Edició inclosa",
    ],
    link: "/contact",
    button: "Reservar",
  },
  {
    title: "Dia complet d’estudi",
    price: "300€",
    unit: "/8h",
    features: [
      "8 hores de gravació",
      "Tot l’equip disponible",
      "Enginyer inclòs",
      "Edició inclosa",
      "Estalvi respecte hores soltes",
    ],
    link: "/contact",
    button: "Reservar",
    featured: true,
    badge: "RECOMANAT",
  },
  {
    title: "Gravació vocal",
    price: "50€",
    unit: "/hora",
    features: [
      "UAD Sphere DLX (microfonia modelada)",
      "Sala completament tractada",
      "Direcció vocal i coaching",
      "Enginyer inclòs",
      "Edició inclosa",
    ],
    link: "/contact",
    button: "Reservar",
  },
];

/* =======================
   PRODUCTION
======================= */

const productionPackages = [
  {
    title: "Sound Design",
    price: "Des de 100€",
    unit: "/patch",
    features: [
      "Disseny sonor per sintetitzadors i samplers",
      "Creació de kits originals i textures úniques",
      "Optimitzat per produccions i live",
      "Consultoria sobre implementació en DAW",
    ],
    link: "/contact",
    button: "Demanar pressupost",
  },
  {
    title: "Producció / Coproducció completa",
    price: "A mida",
    unit: "",
    features: [
      "Preproducció i arranjaments",
      "Sound design i selecció sonora",
      "Producció musical completa",
      "Direcció artística",
      "Mescla inclosa",
    ],
    link: "/contact",
    button: "Demanar pressupost",
    featured: true,
    badge: "SERVEI PRINCIPAL",
  },
  {
    title: "Beat Making",
    price: "Des de 150€",
    unit: "/cançó",
    features: [
      "Producció original adaptada a l’artista",
      "Llicència inclosa",
      "Revisions segons acord",
      "Compatible amb vocals o instrumentals existents",
    ],
    link: "/contact",
    button: "Demanar pressupost",
  },
];

/* =======================
   EDITING
======================= */

const editingPackages = [
  {
    title: "Preparació de sessions",
    price: "30€",
    unit: "/projecte",
    features: [
      "Organització de sessions a Pro Tools",
      "Neteja de pistes i silencis",
      "Ruteig i etiquetatge correcte",
      "Preparació òptima per mescla o enviament",
    ],
    link: "/contact",
    button: "Contractar",
  },
  {
    title: "Edició completa pre-mescla",
    price: "70€",
    unit: "/cançó",
    features: [
      "Comping vocal i instrumental",
      "Correcció de timing musical",
      "Afinació vocal transparent",
      "Edició musical amb criteri artístic",
      "Session ready per mescla professional",
    ],
    link: "/contact",
    button: "Contractar",
    featured: true,
    badge: "MÉS DEMANAT",
  },
  {
    title: "Edició i afinació vocal",
    price: "40€",
    unit: "/cançó",
    features: [
      "Comping vocal",
      "Correcció de timing",
      "Afinació natural i transparent",
      "Respecte total pel caràcter de la veu",
    ],
    link: "/contact",
    button: "Contractar",
  },
];

/* =======================
   PRO SERVICES
======================= */

const proServicePackages = [
  {
    title: "Reamp de guitarres i baixos",
    price: "35€",
    unit: "/pista",
    features: [
      "Reamp amb amplificació real",
      "Captura DI + amp",
      "Fender Blues Jr III / Suhr Reactive Load",
      "Integració directa a la teva sessió",
    ],
    link: "/contact",
    button: "Contractar",
  },
  {
    title: "Mix bus processing extern",
    price: "40€",
    unit: "/cançó",
    features: [
      "Processament analògic del mix bus",
      "Silver Bullet MK2 + SSL Bus+",
      "Sense alterar balances",
      "Ideal per mixers ITB",
    ],
    link: "/contact",
    button: "Contractar",
    featured: true,
    badge: "MÉS SOL·LICITAT",
  },
  {
    title: "Processament analògic de pistes",
    price: "30€",
    unit: "/stem o pista",
    features: [
      "Color analògic amb Silver Bullet",
      "Tape79 Mojo Module",
      "Ideal per drums, bass, synths o vocals",
      "Entrega alineada i fase-correcta",
    ],
    link: "/contact",
    button: "Contractar",
  },
  {
    title: "Assessorament tècnic",
    price: "50€",
    unit: "/hora",
    features: [
      "Flux de treball professional",
      "Equipament i routing",
      "Plugins i gestió de sessions",
      "Optimització d’estudi i acústica",
    ],
    link: "/contact",
    button: "Reservar",
  },
  {
    title: "Mix coaching",
    price: "40€",
    unit: "/hora",
    features: [
      "Feedback tècnic i artístic",
      "Revisió de mescles reals",
      "Orientat a productors i mixers",
      "Sessió 1 a 1",
    ],
    link: "/contact",
    button: "Reservar",
  },
  {
    title: "Listening session professional",
    price: "30€",
    unit: "/hora",
    features: [
      "Escolta crítica en sala tractada",
      "Adam Audio A7V calibrats (Sonarworks)",
      "Feedback honest i constructiu",
      "Ideal abans de publicar o enviar a mescla",
    ],
    link: "/contact",
    button: "Reservar",
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
  grid-template-columns: repeat(3, 1fr);

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
