<template>
  <div>
    <NavigationMenu />
    <section class="hero">
      <div class="hero-content">
        <h1>Dona vida a la teva música</h1>
        <p>
          Producció, mescla, mastering i gravació professional. El teu so,
          portat a la perfecció.
        </p>
        <div class="cta-buttons">
          <NuxtLink to="/contact" class="btn btn-primary">Comença ara</NuxtLink>
          <NuxtLink to="/services" class="btn btn-secondary"
            >Els nostres serveis</NuxtLink
          >
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Per què triar-nos?</h2>
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">🎛️</div>
          <h3>Producció Professional</h3>
          <p>
            Des de la preproducció fins al producte final, t'acompanyem en cada
            pas del procés creatiu.
          </p>
        </div>
        <div class="service-card">
          <div class="service-icon">🎚️</div>
          <h3>Mescla i Mastering</h3>
          <p>
            Equipament d'última generació i oïda experta per aconseguir el
            millor so possible.
          </p>
        </div>
        <div class="service-card">
          <div class="service-icon">🎸</div>
          <h3>Gravació</h3>
          <p>
            Sala acústica tractada i micròfons de primera qualitat per capturar
            cada matís.
          </p>
        </div>
        <div class="service-card">
          <div class="service-icon">🎓</div>
          <h3>Formació</h3>
          <p>
            Aprèn producció, mescla i instruments amb tutorials i cursos
            complets.
          </p>
        </div>
      </div>
    </section>

    <section
      class="section"
      style="background: var(--primary); border-radius: 30px"
    >
      <div class="container">
        <h2 class="section-title">Comença el teu projecte avui</h2>
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
          "
        >
          Més de 100 projectes realitzats amb artistes d'arreu
        </p>
        <div style="text-align: center">
          <NuxtLink to="/contact" class="btn btn-primary">Contacta'ns</NuxtLink>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import NavigationMenu from "~/components/NavigationMenu.vue";
import AppFooter from "~/components/AppFooter.vue";
</script>

<style scoped></style>
