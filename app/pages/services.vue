<template>
  <div>
    <NavigationMenu />

    <div style="padding-top: 100px">
      <section class="section">
        <h1 class="section-title">Preus i paquets</h1>
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 4rem;
          "
        >
          Trieu el paquet que millor s'adapti a les vostres necessitats
        </p>

        <div class="pricing-grid">
          <div class="pricing-card">
            <h3>Mescla</h3>
            <div class="price">
              80€<span style="font-size: 1rem; color: var(--text-secondary)"
                >/cançó</span
              >
            </div>
            <ul class="pricing-features">
              <li>Mescla professional</li>
              <li>Fins a 50 pistes</li>
              <li>3 revisions incloses</li>
              <li>Stems finals</li>
              <li>Lliurament en 5-7 dies</li>
            </ul>
            <NuxtLink
              to="/contact"
              class="btn btn-secondary"
              style="width: 100%; margin-top: 1.5rem"
              >Contractar</NuxtLink
            >
          </div>

          <div class="pricing-card featured">
            <div
              style="
                background: var(--accent);
                color: white;
                padding: 0.5rem;
                border-radius: 20px;
                margin-bottom: 1rem;
                font-weight: bold;
              "
            >
              MÉS POPULAR
            </div>
            <h3>Mescla + Mastering</h3>
            <div class="price">
              120€<span style="font-size: 1rem; color: var(--text-secondary)"
                >/cançó</span
              >
            </div>
            <ul class="pricing-features">
              <li>Tot el paquet de mescla</li>
              <li>Mastering professional</li>
              <li>5 revisions totals</li>
              <li>Formats optimitzats per streaming</li>
              <li>DDP per vinils/CD</li>
              <li>Lliurament en 7 dies</li>
            </ul>
            <NuxtLink
              to="/contact"
              class="btn btn-primary"
              style="width: 100%; margin-top: 1.5rem"
              >Contractar</NuxtLink
            >
          </div>

          <div class="pricing-card">
            <h3>Només Mastering</h3>
            <div class="price">
              50€<span style="font-size: 1rem; color: var(--text-secondary)"
                >/cançó</span
              >
            </div>
            <ul class="pricing-features">
              <li>Mastering professional</li>
              <li>2 revisions incloses</li>
              <li>Formats per streaming i físic</li>
              <li>Anàlisi de qualitat</li>
              <li>Lliurament en 3-5 dies</li>
            </ul>
            <NuxtLink
              to="/contact"
              class="btn btn-secondary"
              style="width: 100%; margin-top: 1.5rem"
              >Contractar</NuxtLink
            >
          </div>
        </div>

        <h2 class="section-title" style="margin-top: 5rem">
          Producció i Gravació
        </h2>

        <div class="pricing-grid">
          <div class="pricing-card">
            <h3>Hora d'Estudi</h3>
            <div class="price">
              40€<span style="font-size: 1rem; color: var(--text-secondary)"
                >/hora</span
              >
            </div>
            <ul class="pricing-features">
              <li>Gravació professional</li>
              <li>Enginy de so inclòs</li>
              <li>Tot l'equipament disponible</li>
              <li>Instruments de l'estudi</li>
              <li>Edició bàsica</li>
            </ul>
            <NuxtLink
              to="/contact"
              class="btn btn-secondary"
              style="width: 100%; margin-top: 1.5rem"
              >Reservar</NuxtLink
            >
          </div>

          <div class="pricing-card">
            <h3>Dia Complet</h3>
            <div class="price">
              280€<span style="font-size: 1rem; color: var(--text-secondary)"
                >/8h</span
              >
            </div>
            <ul class="pricing-features">
              <li>8 hores d'estudi</li>
              <li>Tot inclòs</li>
              <li>Pauses flexibles</li>
              <li>Gravació multi-instrument</li>
              <li>Edició avançada</li>
              <li>Estalvieu 40€</li>
            </ul>
            <NuxtLink
              to="/contact"
              class="btn btn-secondary"
              style="width: 100%; margin-top: 1.5rem"
              >Reservar</NuxtLink
            >
          </div>

          <div class="pricing-card">
            <h3>Producció Completa</h3>
            <div class="price">A mida</div>
            <ul class="pricing-features">
              <li>Preproducció i arranjaments</li>
              <li>Gravació completa</li>
              <li>Producció musical</li>
              <li>Mescla i mastering</li>
              <li>Assessorament continu</li>
              <li>Sessions il·limitades</li>
            </ul>
            <NuxtLink
              to="/contact"
              class="btn btn-secondary"
              style="width: 100%; margin-top: 1.5rem"
              >Demanar pressupost</NuxtLink
            >
          </div>
        </div>

        <h2 class="section-title" style="margin-top: 5rem">Formació</h2>

        <div class="pricing-grid">
          <div class="pricing-card">
            <h3>Classe Individual</h3>
            <div class="price">
              35€<span style="font-size: 1rem; color: var(--text-secondary)"
                >/hora</span
              >
            </div>
            <ul class="pricing-features">
              <li>Atenció personalitzada</li>
              <li>Temari adaptat</li>
              <li>Online o presencial</li>
              <li>Horaris flexibles</li>
              <li>Material inclòs</li>
            </ul>
            <NuxtLink
              to="/contact"
              class="btn btn-secondary"
              style="width: 100%; margin-top: 1.5rem"
              >Reservar</NuxtLink
            >
          </div>

          <div class="pricing-card">
            <h3>Bonos 5 Classes</h3>
            <div class="price">
              150€<span style="font-size: 1rem; color: var(--text-secondary)"
                >/5h</span
              >
            </div>
            <ul class="pricing-features">
              <li>5 classes individuals</li>
              <li>Estalvieu 25€</li>
              <li>Vàlid 3 mesos</li>
              <li>Tots els beneficis</li>
              <li>Seguiment personalitzat</li>
            </ul>
            <NuxtLink
              to="/contact"
              class="btn btn-secondary"
              style="width: 100%; margin-top: 1.5rem"
              >Contractar</NuxtLink
            >
          </div>

          <div class="pricing-card">
            <h3>Curs Intensiu</h3>
            <div class="price">
              400€<span style="font-size: 1rem; color: var(--text-secondary)"
                >/mes</span
              >
            </div>
            <ul class="pricing-features">
              <li>8 classes al mes</li>
              <li>2 classes setmanals</li>
              <li>Projectes pràctics</li>
              <li>Certificat final</li>
              <li>Accés a recursos</li>
              <li>Suport continu</li>
            </ul>
            <NuxtLink
              to="/contact"
              class="btn btn-secondary"
              style="width: 100%; margin-top: 1.5rem"
              >Inscriure's</NuxtLink
            >
          </div>
        </div>

        <div
          style="
            background: var(--card-bg);
            padding: 3rem;
            border-radius: 20px;
            margin-top: 5rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
          "
        >
          <h3 style="font-size: 2rem; margin-bottom: 1rem">
            Descomptes per volum
          </h3>
          <p
            style="
              color: var(--text-secondary);
              margin-bottom: 2rem;
              font-size: 1.1rem;
            "
          >
            ✓ 10% de descompte a partir de 5 cançons<br >
            ✓ 15% de descompte a partir de 10 cançons (EP/Àlbum)<br >
            ✓ Pressupost personalitzat per projectes grans
          </p>
          <NuxtLink to="/contact" class="btn btn-primary"
            >Demanar pressupost</NuxtLink
          >
        </div>
      </section>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import NavigationMenu from "~/components/NavigationMenu.vue";
import AppFooter from "~/components/AppFooter.vue";
</script>
