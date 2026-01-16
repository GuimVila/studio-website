<template>
  <section class="hero-modern">
    <div class="hero-background">
      <div class="hero-image-wrapper">
        <NuxtImg
          v-for="(img, index) in backgroundImages"
          :key="index"
          :class="['hero-bg-image', { active: currentImageIndex === index }]"
          :src="img"
          :alt="$t('hero.imageAlt')"
          format="webp"
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="eager"
          :fetchpriority="index === 0 ? 'high' : 'low'"
        />
      </div>
      <div class="hero-overlay-gradient" />
    </div>

    <div class="hero-container">
      <div class="hero-content-wrapper">
        <div class="hero-badges">
          <span class="badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path
                d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"
              />
            </svg>
            Riells i Viabrea
          </span>
          <!-- <span class="badge badge-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            {{ $t("hero.badges.artist") || "Artista" }}
          </span> -->
        </div>

        <h1 class="hero-title">
          <span class="hero-title-line">{{ $t("hero.title") }}</span>
        </h1>

        <p class="hero-subtitle">{{ $t("hero.subtitle") }}</p>

        <div class="hero-features">
          <div class="feature-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{{
              $t("hero.features.production") || "Producció professional"
            }}</span>
          </div>
          <div class="feature-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M2 10v3" />
              <path d="M6 6v11" />
              <path d="M10 3v18" />
              <path d="M14 8v7" />
              <path d="M18 5v13" />
              <path d="M22 10v3" />
            </svg>
            <span>{{
              $t("hero.features.mixing") || "Mescla i masterització"
            }}</span>
          </div>
          <div class="feature-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
              />
            </svg>
            <span>{{ $t("hero.features.resources") || "Recursos únics" }}</span>
          </div>
        </div>

        <div class="hero-cta-group">
          <LocaleLink to="/contact" class="cta-primary">
            <span>{{ $t("hero.ctaPrimary") }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </LocaleLink>
          <LocaleLink to="/services" class="cta-secondary">
            <span>{{ $t("hero.ctaSecondary") }}</span>
          </LocaleLink>
          <LocaleLink to="/resources/roadmap" class="cta-tertiary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>{{ $t("hero.ctaRoadmap") || "Roadmap interactiu" }}</span>
          </LocaleLink>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">10+</div>
            <div class="stat-label">
              {{ $t("hero.stats.experience") || "Anys d'experiència" }}
            </div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <div class="stat-value stat-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
                />
              </svg>
            </div>
            <div class="stat-label">
              {{ $t("hero.stats.resources") || "Recursos setmanals" }}
            </div>
          </div>

          <div class="stat-divider" />
          <div class="stat-item">
            <div class="stat-value">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <div class="stat-label">
              {{ $t("hero.stats.quality") || "Qualitat garantida" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-scroll-indicator">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

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
  if (imageInterval) {
    clearInterval(imageInterval);
  }
});
</script>

<style scoped>
.hero-modern {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--background);
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-image-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  animation: kenBurns 20s ease-in-out infinite;
}

.hero-bg-image.active {
  opacity: 1;
  z-index: 1;
}

.stat-icon {
  color: var(--accent);
  opacity: 0.9;
}

@keyframes kenBurns {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

.hero-overlay-gradient {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    radial-gradient(
      ellipse 1400px 800px at 35% 50%,
      rgba(208, 138, 63, 0.08),
      transparent 60%
    ),
    linear-gradient(
      110deg,
      rgba(10, 10, 10, 0.95) 0%,
      rgba(10, 10, 10, 0.88) 45%,
      rgba(10, 10, 10, 0.75) 65%,
      rgba(10, 10, 10, 0.4) 100%
    );
}

:root[data-theme="light"] .hero-overlay-gradient {
  background:
    radial-gradient(
      ellipse 1400px 800px at 35% 50%,
      rgba(208, 138, 63, 0.12),
      transparent 60%
    ),
    linear-gradient(
      110deg,
      rgba(246, 244, 241, 0.98) 0%,
      rgba(246, 244, 241, 0.92) 45%,
      rgba(246, 244, 241, 0.82) 65%,
      rgba(246, 244, 241, 0.5) 100%
    );
}

.hero-container {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1400px;
  padding: clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 3rem);
  margin: 0 auto;
}

.hero-content-wrapper {
  max-width: 700px;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-out 0.2s backwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

:root[data-theme="light"] .badge {
  background: rgba(20, 20, 20, 0.06);
  border-color: rgba(20, 20, 20, 0.12);
  color: rgba(20, 20, 20, 0.85);
}

.badge-accent {
  background: linear-gradient(
    135deg,
    rgba(208, 138, 63, 0.15),
    rgba(208, 138, 63, 0.08)
  );
  border-color: rgba(208, 138, 63, 0.3);
  color: var(--accent-light);
}

:root[data-theme="light"] .badge-accent {
  background: linear-gradient(
    135deg,
    rgba(208, 138, 63, 0.18),
    rgba(208, 138, 63, 0.1)
  );
  color: var(--accent-dark);
}

.badge svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.hero-title {
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 900;
  line-height: 1.05;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
  animation: fadeInUp 1s ease-out 0.3s backwards;
}

.hero-title-line {
  display: inline-block;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #ffffff 30%,
    var(--accent-light) 60%,
    var(--accent) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 8s ease infinite;
}

:root[data-theme="light"] .hero-title-line {
  background: linear-gradient(
    135deg,
    #141414 0%,
    #141414 30%,
    var(--accent-dark) 60%,
    var(--accent) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 2.5rem 0;
  max-width: 600px;
  animation: fadeInUp 1s ease-out 0.4s backwards;
}

:root[data-theme="light"] .hero-subtitle {
  color: rgba(20, 20, 20, 0.75);
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
  animation: fadeInUp 1s ease-out 0.5s backwards;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  font-weight: 500;
}

:root[data-theme="light"] .feature-item {
  color: rgba(20, 20, 20, 0.7);
}

.feature-item svg {
  color: var(--accent);
  flex-shrink: 0;
}

.hero-cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
  animation: fadeInUp 1s ease-out 0.6s backwards;
}

.cta-primary,
.cta-secondary,
.cta-tertiary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 100px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
}

.cta-primary {
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  color: #fff;
  box-shadow: 0 10px 30px rgba(208, 138, 63, 0.3);
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(208, 138, 63, 0.4);
}

.cta-primary svg {
  transition: transform 0.3s ease;
}

.cta-primary:hover svg {
  transform: translateX(4px);
}

.cta-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

:root[data-theme="light"] .cta-secondary {
  background: rgba(20, 20, 20, 0.06);
  border-color: rgba(20, 20, 20, 0.15);
  color: var(--text);
}

.cta-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

:root[data-theme="light"] .cta-secondary:hover {
  background: rgba(20, 20, 20, 0.1);
  border-color: rgba(20, 20, 20, 0.25);
}

.cta-tertiary {
  background: transparent;
  border: 1.5px solid rgba(208, 138, 63, 0.4);
  color: var(--accent-light);
  padding: 0.875rem 1.75rem;
  font-size: 0.95rem;
}

:root[data-theme="light"] .cta-tertiary {
  color: var(--accent-dark);
}

.cta-tertiary:hover {
  background: rgba(208, 138, 63, 0.1);
  border-color: rgba(208, 138, 63, 0.6);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  animation: fadeInUp 1s ease-out 0.7s backwards;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  min-height: 34px; /* clau: mateixa alçada per a 10+ i per a icones */
  display: flex;
  align-items: center; /* centra verticalment el contingut dins aquesta alçada */
  gap: 0.5rem;
  font-size: 1.5rem;
}

.stat-value svg {
  width: 24px;
  height: 24px;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

:root[data-theme="light"] .stat-label {
  color: rgba(20, 20, 20, 0.55);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
}

:root[data-theme="light"] .stat-divider {
  background: rgba(20, 20, 20, 0.15);
}

.hero-scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  color: rgba(255, 255, 255, 0.5);
  animation: bounce 2s ease-in-out infinite;
}

:root[data-theme="light"] .hero-scroll-indicator {
  color: rgba(20, 20, 20, 0.4);
}

@keyframes bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(10px);
  }
}

@media (max-width: 1024px) {
  .hero-overlay-gradient {
    background:
      radial-gradient(
        ellipse 800px 600px at 50% 40%,
        rgba(208, 138, 63, 0.1),
        transparent 65%
      ),
      linear-gradient(
        180deg,
        rgba(10, 10, 10, 0.92) 0%,
        rgba(10, 10, 10, 0.85) 50%,
        rgba(10, 10, 10, 0.75) 100%
      );
  }

  :root[data-theme="light"] .hero-overlay-gradient {
    background:
      radial-gradient(
        ellipse 800px 600px at 50% 40%,
        rgba(208, 138, 63, 0.12),
        transparent 65%
      ),
      linear-gradient(
        180deg,
        rgba(246, 244, 241, 0.95) 0%,
        rgba(246, 244, 241, 0.88) 50%,
        rgba(246, 244, 241, 0.8) 100%
      );
  }

  .hero-content-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-modern {
    min-height: 100svh;
  }

  .hero-container {
    padding: 2rem 1.5rem;
  }

  .hero-content-wrapper {
    text-align: center;
  }

  .hero-badges {
    justify-content: center;
  }

  .hero-features {
    align-items: center;
  }

  .hero-cta-group {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-primary,
  .cta-secondary,
  .cta-tertiary {
    justify-content: center;
    width: 100%;
  }

  .hero-stats {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }

  .stat-item {
    align-items: center;
    text-align: center;
  }

  .stat-divider {
    display: none;
  }

  .hero-scroll-indicator {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: clamp(2rem, 10vw, 2.5rem);
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-features {
    gap: 0.75rem;
  }

  .feature-item {
    font-size: 0.875rem;
  }

  .cta-primary,
  .cta-secondary,
  .cta-tertiary {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }
}
</style>
