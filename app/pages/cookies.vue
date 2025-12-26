<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="section-title">Política de Cookies</h1>

        <p>
          Aquesta pàgina explica què són les cookies, com s’utilitzen
          en aquest lloc web i com pots gestionar-les.
        </p>

        <h2>Què són les cookies?</h2>
        <p>
          Les cookies són petits fitxers de text que s’emmagatzemen al dispositiu
          de l’usuari quan visita una pàgina web. Serveixen per garantir el bon
          funcionament del lloc, millorar l’experiència de navegació i obtenir
          informació estadística.
        </p>

        <h2>Tipus de cookies utilitzades</h2>

        <h3>Cookies tècniques o essencials</h3>
        <p>
          Aquestes cookies són necessàries per al funcionament correcte del lloc
          web i no requereixen el consentiment de l’usuari. Inclouen, per exemple,
          les cookies que permeten guardar les preferències de consentiment.
        </p>

        <h3>Cookies no essencials</h3>
        <p>
          Aquest lloc web pot utilitzar cookies analítiques o de seguiment
          (com Google Analytics o serveis similars) únicament si l’usuari
          proporciona el seu consentiment explícit mitjançant el banner de
          cookies.
        </p>

        <h2>Gestió del consentiment</h2>
        <p>
          L’usuari pot acceptar o rebutjar les cookies no essencials a través del
          banner de cookies que apareix en accedir al lloc web. El consentiment
          es pot modificar o retirar en qualsevol moment.
        </p>

        <h2>Com desactivar les cookies?</h2>
        <p>
          A més del sistema de consentiment del lloc web, l’usuari pot configurar
          el seu navegador per bloquejar o eliminar les cookies instal·lades.
          Tingues en compte que això pot afectar el funcionament del lloc.
        </p>

        <h2>Canvis en la política de cookies</h2>
        <p>
          Aquesta política pot actualitzar-se periòdicament. Es recomana revisar-la
          regularment per estar informat de possibles canvis.
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
        "Consulta la política de cookies de Guillem Vila i descobreix com es gestionen les cookies i el consentiment en aquest lloc web.",
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
