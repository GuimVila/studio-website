<template>
  <section class="hero-modern">
    <div class="hero-background">
      <div class="hero-image-wrapper">
        <NuxtImg
          v-for="(img, index) in backgroundImages"
          :key="img"
          :class="['hero-bg-image', { active: currentImageIndex === index }]"
          :src="img"
          :alt="$t('hero.imageAlt')"
          format="webp"
          sizes="100vw"
          loading="eager"
          :fetchpriority="index === 0 ? 'high' : 'low'"
        />
      </div>
      <div class="hero-overlay-gradient" />
    </div>

    <div class="hero-container">
      <div class="hero-content-wrapper">
        <div class="hero-badges">
          <span class="badge">{{ $t("hero.badges.studio") }}</span>
          <span class="badge badge-accent">{{ $t("hero.badges.resources") }}</span>
        </div>

        <h1 class="hero-title">
          <span>{{ $t("hero.title") }}</span>
        </h1>

        <p class="hero-subtitle">{{ $t("hero.subtitle") }}</p>

        <div class="hero-cta-group">
          <LocaleLink to="/contact" class="cta-primary">
            <span>{{ $t("hero.ctaPrimary") }}</span>
            <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
          </LocaleLink>

          <LocaleLink to="/resources/roadmap" class="cta-secondary">
            <span>{{ $t("hero.ctaRoadmap") }}</span>
          </LocaleLink>

          <LocaleLink to="/services" class="cta-tertiary">
            <span>{{ $t("hero.ctaSecondary") }}</span>
          </LocaleLink>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const backgroundImages = [
  "/images/foto3_hero.jpg",
  "/images/foto5_hero.jpg",
  "/images/final_bloc_foto2_hero.jpg",
];

const currentImageIndex = ref(0);
let imageInterval = null;

onMounted(() => {
  imageInterval = setInterval(() => {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % backgroundImages.length;
  }, 5000);
});

onUnmounted(() => {
  if (imageInterval) clearInterval(imageInterval);
});
</script>

<style scoped>
.hero-modern {
  position: relative;
  min-height: 92svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--background);
}

.hero-background,
.hero-image-wrapper,
.hero-bg-image,
.hero-overlay-gradient {
  position: absolute;
  inset: 0;
}

.hero-background {
  z-index: 0;
}

.hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity 1.3s ease-in-out;
  transform: scale(1.02);
}

.hero-bg-image.active {
  opacity: 1;
}

.hero-overlay-gradient {
  z-index: 1;
  background:
    linear-gradient(
      90deg,
      rgba(10, 10, 10, 0.95) 0%,
      rgba(10, 10, 10, 0.86) 46%,
      rgba(10, 10, 10, 0.55) 100%
    ),
    linear-gradient(
      180deg,
      rgba(10, 10, 10, 0.42) 0%,
      rgba(10, 10, 10, 0.9) 100%
    );
}

:root[data-theme="light"] .hero-overlay-gradient {
  background:
    linear-gradient(
      90deg,
      rgba(246, 244, 241, 0.98) 0%,
      rgba(246, 244, 241, 0.9) 46%,
      rgba(246, 244, 241, 0.58) 100%
    ),
    linear-gradient(
      180deg,
      rgba(246, 244, 241, 0.34) 0%,
      rgba(246, 244, 241, 0.92) 100%
    );
}

.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(7rem, 11vw, 9rem) clamp(1.25rem, 5vw, 3rem)
    clamp(3.5rem, 7vw, 5rem);
}

.hero-content-wrapper {
  max-width: 780px;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0.45rem 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.82rem;
  font-weight: 750;
}

.badge-accent {
  border-color: rgba(208, 138, 63, 0.45);
  background: rgba(208, 138, 63, 0.14);
  color: var(--accent-light);
}

:root[data-theme="light"] .badge {
  border-color: rgba(20, 20, 20, 0.14);
  background: rgba(20, 20, 20, 0.06);
  color: rgba(20, 20, 20, 0.82);
}

:root[data-theme="light"] .badge-accent {
  border-color: rgba(208, 138, 63, 0.5);
  background: rgba(208, 138, 63, 0.16);
  color: var(--accent-dark);
}

.hero-title {
  max-width: 740px;
  margin: 0 0 1.15rem;
  font-size: clamp(3.8rem, 6vw, 5rem);
  font-weight: 930;
  line-height: 1.02;
  letter-spacing: 0;
}

.hero-title span {
  background: linear-gradient(135deg, #fff 0%, #fff 48%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:root[data-theme="light"] .hero-title span {
  background: linear-gradient(
    135deg,
    #141414 0%,
    #141414 48%,
    var(--accent-dark) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  max-width: 650px;
  margin: 0 0 1.6rem;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.18rem;
  line-height: 1.62;
}

:root[data-theme="light"] .hero-subtitle {
  color: rgba(20, 20, 20, 0.72);
}

.hero-cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-bottom: 0;
}

.cta-primary,
.cta-secondary,
.cta-tertiary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0.95rem 1.35rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.cta-primary {
  gap: 0.55rem;
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  color: #fff;
  box-shadow: 0 12px 34px rgba(208, 138, 63, 0.3);
}

.cta-secondary {
  border: 1px solid rgba(208, 138, 63, 0.5);
  background: rgba(208, 138, 63, 0.12);
  color: var(--accent-light);
}

.cta-tertiary {
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

:root[data-theme="light"] .cta-secondary {
  color: var(--accent-dark);
}

:root[data-theme="light"] .cta-tertiary {
  border-color: rgba(20, 20, 20, 0.14);
  background: rgba(20, 20, 20, 0.06);
  color: var(--text);
}

.cta-primary:hover,
.cta-secondary:hover,
.cta-tertiary:hover {
  transform: translateY(-2px);
}

.cta-primary:hover {
  box-shadow: 0 16px 44px rgba(208, 138, 63, 0.42);
}

.cta-secondary:hover {
  border-color: rgba(208, 138, 63, 0.78);
  background: rgba(208, 138, 63, 0.18);
}

.cta-tertiary:hover {
  border-color: rgba(255, 255, 255, 0.32);
  background: rgba(255, 255, 255, 0.12);
}

@media (max-width: 1100px) {
  .hero-title {
    font-size: 4.1rem;
  }
}

@media (max-width: 780px) {
  .hero-modern {
    min-height: auto;
    align-items: flex-start;
  }

  .hero-bg-image {
    object-position: 58% center;
  }

  .hero-overlay-gradient {
    background:
      linear-gradient(
        180deg,
        rgba(10, 10, 10, 0.9) 0%,
        rgba(10, 10, 10, 0.82) 48%,
        rgba(10, 10, 10, 0.95) 100%
      );
  }

  :root[data-theme="light"] .hero-overlay-gradient {
    background:
      linear-gradient(
        180deg,
        rgba(246, 244, 241, 0.95) 0%,
        rgba(246, 244, 241, 0.86) 48%,
        rgba(246, 244, 241, 0.96) 100%
      );
  }

  .hero-container {
    padding: 4.75rem 1.35rem 2.25rem;
  }

  .hero-content-wrapper {
    max-width: none;
  }

  .hero-badges {
    gap: 0.5rem;
    margin-bottom: 0.8rem;
  }

  .badge {
    min-height: 30px;
    padding: 0.35rem 0.65rem;
    font-size: 0.74rem;
  }

  .hero-title {
    margin-bottom: 0.8rem;
    font-size: 2.55rem;
    line-height: 1.02;
  }

  .hero-subtitle {
    margin-bottom: 0.95rem;
    font-size: 0.96rem;
    line-height: 1.45;
  }

  .hero-cta-group {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.65rem;
    margin-bottom: 0;
  }

  .cta-primary,
  .cta-secondary,
  .cta-tertiary {
    width: 100%;
    min-height: 46px;
    padding: 0.78rem 1rem;
    font-size: 0.94rem;
  }

}

@media (max-width: 420px) {
  .hero-title {
    font-size: 2.3rem;
  }
}
</style>
