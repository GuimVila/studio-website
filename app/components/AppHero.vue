<template>
  <section class="hero hero--bg">
    <!-- Imatge com a layer -->
    <NuxtImg
      class="hero-media"
      src="/images/hero-collage.png"
      :alt="$t('hero.imageAlt')"
      format="webp"
      sizes="(max-width: 768px) 100vw, 1400px"
    />

    <!-- Overlay -->
    <div class="hero-overlay" />

    <!-- Contingut -->
    <div class="hero-content hero-content--bg">
      <h1>{{ $t('hero.title') }}</h1>
      <p>{{ $t('hero.subtitle') }}</p>
      <div class="cta-buttons">
        <NuxtLink to="/contact" class="btn btn-primary">{{ $t('hero.ctaPrimary') }}</NuxtLink>
        <NuxtLink to="/services" class="btn btn-secondary">{{ $t('hero.ctaSecondary') }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero.hero--bg {
  min-height: clamp(520px, 70vh, 780px);
  padding: clamp(3rem, 6vw, 6rem) 1.5rem;
  overflow: hidden;
  background-color: var(--background);
  margin-top: calc(var(--header-height, 88px) + 1rem);
  position: relative;
}

/* La imatge */
.hero-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
  transform: scale(1.02); /* evita línies/bleeding */
}

/* Overlay per defecte (dark) */
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      1200px 600px at 25% 40%,
      rgba(208, 138, 63, 0.1),
      transparent 60%
    ),
    linear-gradient(
      90deg,
      rgba(10, 10, 10, 0.78) 0%,
      rgba(10, 10, 10, 0.55) 55%,
      rgba(10, 10, 10, 0.18) 100%
    );
}

/* Light: enfosqueix més la imatge (això és la clau) */
:root[data-theme="light"] .hero-overlay {
  background:
    radial-gradient(
      1200px 600px at 25% 40%,
      rgba(208, 138, 63, 0.1),
      transparent 60%
    ),
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.58) 0%,
      rgba(0, 0, 0, 0.38) 55%,
      rgba(0, 0, 0, 0.18) 100%
    );
}

/* Contingut */
.hero-content.hero-content--bg {
  position: relative;
  z-index: 1;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  text-align: left;
}

.hero-content.hero-content--bg h1 {
  font-size: clamp(2.2rem, 4.2vw, 3.4rem);
  line-height: 1.05;
  margin: 0 0 1rem 0;
}

.hero-content.hero-content--bg p {
  margin: 0 0 1.8rem 0;
  color: var(--text-secondary);
  font-size: clamp(1rem, 1.3vw, 1.15rem);
  line-height: 1.6;
}

/* Si vols que el text sigui sempre molt contrastat al hero */
.hero-content.hero-content--bg p,
.btn-secondary {
  color: #fff;
}

@media (max-width: 768px) {
  .hero.hero--bg {
    padding: 2.5rem 1.25rem;
  }

  .hero-media {
    object-position: center;
  }

  .hero-content.hero-content--bg {
    text-align: center;
  }

  .hero-overlay {
    background: linear-gradient(
      180deg,
      rgba(10, 10, 10, 0.78) 0%,
      rgba(10, 10, 10, 0.55) 60%,
      rgba(10, 10, 10, 0.18) 100%
    );
  }

  :root[data-theme="light"] .hero-overlay {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.4) 60%,
      rgba(0, 0, 0, 0.18) 100%
    );
  }

  .cta-buttons {
    justify-content: center;
  }
}
</style>
