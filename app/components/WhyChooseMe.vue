<template>
  <section class="why-choose-section">
    <div class="why-choose-container">
      <div class="section-header">
        <h2 class="section-title">{{ $t("whyMe.title") }}</h2>
      </div>

      <div class="services-grid-modern">
        <ServiceCard
          v-for="(item, index) in services"
          :key="index"
          :title="item.title"
          :description="item.description"
          :image="item.image"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import ServiceCard from "~/components/ServiceCard.vue";

const { t } = useI18n();

const services = computed(() => [
  {
    title: t("whyMe.items.production.title"),
    description: t("whyMe.items.production.description"),
    image: "/images/services/produccio.png",
  },
  {
    title: t("whyMe.items.mixing.title"),
    description: t("whyMe.items.mixing.description"),
    image: "/images/services/mescla.png",
  },
  {
    title: t("whyMe.items.recording.title"),
    description: t("whyMe.items.recording.description"),
    image: "/images/services/gravacio.png",
  },
  {
    title: t("whyMe.items.resources.title"),
    description: t("whyMe.items.resources.description"),
    image: "/images/services/recursos.png",
  },
]);
</script>

<style scoped>
.why-choose-section {
  padding: clamp(4rem, 8vw, 8rem) 0;
  background: var(--background);
  position: relative;
}

.why-choose-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 3rem);
}

.section-header {
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
  background: linear-gradient(
    135deg,
    var(--text) 0%,
    var(--text) 40%,
    var(--accent) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.services-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

@media (min-width: 768px) {
  .services-grid-modern {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .services-grid-modern {
    gap: 3rem;
  }
}
</style>
