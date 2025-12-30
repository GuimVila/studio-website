<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="section-title">Política de Cookies</h1>

        <p>
          Aquesta pàgina explica què són les cookies, quines s’utilitzen en
          aquest lloc web i com pots gestionar-les.
        </p>

        <h2>Què són les cookies?</h2>
        <p>
          Les cookies són petits fitxers de text que s’emmagatzemen al
          dispositiu quan visites una pàgina web. Poden servir per garantir el
          bon funcionament del lloc, recordar preferències o obtenir informació
          estadística.
        </p>

        <h2>Cookies utilitzades en aquest lloc web</h2>

        <h3>Cookies tècniques o essencials</h3>
        <p>
          Aquest lloc web pot utilitzar cookies estrictament necessàries per al
          funcionament tècnic i la seguretat (per exemple, cookies pròpies del
          navegador o del servidor). Aquestes cookies no s’utilitzen per fer
          publicitat ni per identificar l’usuari i, en general, no requereixen
          consentiment.
        </p>

        <h3>Analítica</h3>
        <p>
          Utilitzem Plausible Analytics per entendre de manera agregada i
          anònima com es fa servir el web (pàgines visitades, referents,
          dispositiu, etc.). Plausible està dissenyat per funcionar sense
          cookies i sense identificació personal dels usuaris.
        </p>

        <h2>Com gestionar o bloquejar cookies i analítica</h2>
        <p>
          Pots configurar el teu navegador per bloquejar o eliminar cookies.
          Tingues en compte que bloquejar cookies tècniques pot afectar el
          funcionament del lloc web.
        </p>
        <p>
          Si vols evitar l’analítica, pots utilitzar bloquejadors de contingut
          (adblockers) o desactivar JavaScript al navegador. Això pot afectar
          certes funcionalitats del web.
        </p>

        <h2>Canvis en la política de cookies</h2>
        <p>
          Aquesta política pot actualitzar-se periòdicament. Es recomana
          revisar-la regularment per estar informat de possibles canvis.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title:
    "Política de Cookies | Guillem Vila · Artista, productor musical i enginyer de so",
  meta: [
    {
      name: "description",
      content:
        "Política de cookies de Guillem Vila: informació sobre cookies tècniques i analítica amb Plausible, i com gestionar-les al navegador.",
    },
  ],
});
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 3rem);
  font-weight: 900;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #ff6b35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  color: var(--text);
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

h3 {
  color: var(--text);
  font-size: 1.2rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
}
</style>
