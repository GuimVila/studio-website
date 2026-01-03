<template>
  <section class="hero hero--bg">
    <div class="hero-overlay" />
    <div class="hero-content hero-content--bg">
      <h1>Dona vida a la teva música</h1>
      <p>
        Producció, mescla, i gravació professional. El teu so, portat a la
        perfecció.
      </p>
      <div class="cta-buttons">
        <NuxtLink to="/contact" class="btn btn-primary"> Comença ara </NuxtLink>
        <NuxtLink to="/services" class="btn btn-secondary">
          Els meus serveis
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Variant: hero amb background image */
.hero.hero--bg {
  min-height: clamp(520px, 70vh, 780px);
  padding: clamp(3rem, 6vw, 6rem) 1.5rem;
  border-radius: 22px;
  overflow: hidden;
  background-image: url("/images/hero-collage.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center 35%;
  background-color: var(--background);
  margin-top: calc(var(--header-height, 88px) + 1rem);
  position: relative;
}

.hero.hero--bg::before {
  content: none;
}

.hero.hero--bg .hero-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      1200px 600px at 25% 40%,
      rgba(208, 138, 63, 0.12),
      transparent 60%
    ),
    linear-gradient(
      90deg,
      var(--overlay-1) 0%,
      var(--overlay-2) 55%,
      rgba(0, 0, 0, 0.05) 100%
    );
}

.hero.hero--bg .hero-content.hero-content--bg {
  position: relative;
  z-index: 1;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  text-align: left;
}

.hero.hero--bg .hero-content.hero-content--bg h1 {
  font-size: clamp(2.2rem, 4.2vw, 3.4rem);
  line-height: 1.05;
  margin: 0 0 1rem 0;
  font-weight: 900;
  background: none;
  -webkit-text-fill-color: unset;
  color: var(--text);
}

.hero.hero--bg .hero-content.hero-content--bg p {
  margin: 0 0 1.8rem 0;
  color: var(--text-secondary);
  font-size: clamp(1rem, 1.3vw, 1.15rem);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero.hero--bg {
    padding: 2.5rem 1.25rem;
    background-position: center;
  }

  .hero.hero--bg .hero-content.hero-content--bg {
    text-align: center;
  }

  .hero.hero--bg .hero-overlay {
    background: linear-gradient(
      180deg,
      var(--overlay-1) 0%,
      var(--overlay-2) 60%,
      rgba(0, 0, 0, 0.08) 100%
    );
  }

  .hero.hero--bg .cta-buttons {
    justify-content: center;
  }
}
</style>
