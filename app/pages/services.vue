<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title heading-accent">{{ t("services.title") }}</h1>
      <p class="section-subtitle">
        {{ t("services.subtitle") }}
      </p>

      <!-- MIXING -->
      <h2 class="section-title section-title-margin">
        {{ t("services.sections.mixing") }}
      </h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in mixingPackages"
          :key="'mix-' + i"
          v-bind="pack"
        />
      </div>

      <!-- TRACKING -->
      <h2 class="section-title section-title-margin">
        {{ t("services.sections.tracking") }}
      </h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in trackingPackages"
          :key="'track-' + i"
          v-bind="pack"
        />
      </div>

      <!-- PRODUCTION -->
      <h2 class="section-title section-title-margin">
        {{ t("services.sections.production") }}
      </h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in productionPackages"
          :key="'prod-' + i"
          v-bind="pack"
        />
      </div>

      <!-- EDITING -->
      <h2 class="section-title section-title-margin">
        {{ t("services.sections.editing") }}
      </h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in editingPackages"
          :key="'edit-' + i"
          v-bind="pack"
        />
      </div>

      <!-- PRO SERVICES -->
      <h2 class="section-title section-title-margin">
        {{ t("services.sections.pro") }}
      </h2>
      <div class="pricing-grid">
        <PricingCard
          v-for="(pack, i) in proServicePackages"
          :key="'pro-' + i"
          v-bind="pack"
        />
      </div>

      <!-- VOLUME DISCOUNTS -->
      <div class="volume-discounts">
        <h3>{{ t("services.volumeDiscounts.title") }}</h3>
        <p>
          <span v-for="(line, idx) in volumeLines" :key="idx">
            {{ line }}<br >
          </span>
        </p>
        <NuxtLink :to="localePath('/contact')" class="btn btn-primary">
          {{ t("services.volumeDiscounts.cta") }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import PricingCard from "~/components/PricingCard.vue";
import { useI18n, useLocalePath } from "#i18n";

const { t, tm, rt } = useI18n();
const localePath = useLocalePath();

const volumeLines = computed(() => {
  const raw = tm("services.volumeDiscounts.lines");
  return Array.isArray(raw) ? raw.map((x) => rt(x)) : [];
});

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function toText(v) {
  // v pot ser string o un “message node” (AST)
  if (v == null) return "";
  if (typeof v === "string") return v;
  // rt() converteix nodes/compilats a string
  return rt(v);
}

function normalizePackages(list) {
  return asArray(list).map((p) => {
    const out = { ...p };

    // text fields
    out.title = toText(p?.title);
    out.price = toText(p?.price);
    out.unit = toText(p?.unit);
    out.button = toText(p?.button);
    out.badge = p?.badge ? toText(p.badge) : null;

    // arrays
    out.features = Array.isArray(p?.features) ? p.features.map(toText) : [];

    // link localitzat
    out.link = p?.link ? localePath(toText(p.link)) : localePath("/contact");

    // booleans (clau del “featured”)
    out.featured = Boolean(p?.featured);

    return out;
  });
}

const mixingPackages = computed(() =>
  normalizePackages(tm("services.packages.mixing"))
);
const trackingPackages = computed(() =>
  normalizePackages(tm("services.packages.tracking"))
);
const productionPackages = computed(() =>
  normalizePackages(tm("services.packages.production"))
);
const editingPackages = computed(() =>
  normalizePackages(tm("services.packages.editing"))
);
const proServicePackages = computed(() =>
  normalizePackages(tm("services.packages.pro"))
);

useHead(() => ({
  title: t("services.seo.title"),
  meta: [{ name: "description", content: t("services.seo.description") }],
}));
</script>

<style scoped>
.section-title-margin {
  margin-top: 5rem;
}

.section-title.section-title-margin {
  opacity: 0.9;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.volume-discounts {
  background: var(--surface);
  padding: 3rem;
  border-radius: 20px;
  margin-top: 5rem;
  text-align: center;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-1);
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
