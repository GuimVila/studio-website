<template>
  <section class="why-choose-section">
    <div class="why-choose-container">
      <div class="section-header">
        <h2 class="section-title">{{ $t("whyMe.title") }}</h2>
      </div>

      <div class="services-grid-modern">
        <LocaleLink
          v-for="item in services"
          :key="item.key"
          class="service-link"
          :to="item.to"
        >
          <ServiceCard
            :title="item.title"
            :description="item.description"
            :image="item.image"
          />
        </LocaleLink>
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
    key: "production",
    title: t("whyMe.items.production.title"),
    description: t("whyMe.items.production.description"),
    image: "/images/services/produccio.png",
    to: "/services",
  },
  {
    key: "mixing",
    title: t("whyMe.items.mixing.title"),
    description: t("whyMe.items.mixing.description"),
    image: "/images/services/mescla.png",
    to: "/services",
  },
  {
    key: "recording",
    title: t("whyMe.items.recording.title"),
    description: t("whyMe.items.recording.description"),
    image: "/images/services/gravacio.png",
    to: "/services",
  },
  {
    key: "resources",
    title: t("whyMe.items.resources.title"),
    description: t("whyMe.items.resources.description"),
    image: "/images/services/recursos.png",
    to: "/resources/roadmap",
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
  font-size: 3rem;
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

.service-link {
  display: block;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

@media (min-width: 768px) {
  .services-grid-modern {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .section-title {
    font-size: 2.2rem;
  }
}

@media (min-width: 1200px) {
  .services-grid-modern {
    gap: 3rem;
  }
}
</style>
