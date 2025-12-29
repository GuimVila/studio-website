<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="section-title">Política de Privacitat</h1>

        <h2>Responsable del tractament</h2>
        <p>
          El responsable del tractament de les dades personals és Guillem Vila,
          artista, productor musical i enginyer de so. Pots contactar a través
          del correu electrònic: info@guillemvila.com
        </p>

        <h2>Base legal del tractament</h2>
        <p>
          La base legal per al tractament de les dades personals és el
          consentiment explícit de l’usuari, atorgat mitjançant els formularis
          disponibles en aquest lloc web. L’usuari pot retirar el consentiment
          en qualsevol moment.
        </p>

        <h2>Conservació de les dades</h2>
        <p>
          Les dades personals es conservaran mentre existeixi una relació amb
          l’usuari o fins que aquest sol·liciti la seva supressió.
        </p>

        <h2>1. Informació que recopilem</h2>
        <ul>
          <li>Correu electrònic quan l’usuari es subscriu a la newsletter.</li>
          <li>Nom, cognoms i correu electrònic quan l'usuari omple el formulari de contacte.</li>
          <li>Dades de navegació (cookies, adreça IP, preferències).</li>
          <li>
            Informació enviada voluntàriament mitjançant formularis de contacte.
          </li>
        </ul>

        <h2>2. Ús de la informació</h2>
        <ul>
          <li>Enviar comunicacions relacionades amb la newsletter.</li>
          <li>Millorar el funcionament i contingut del lloc web.</li>
          <li>Respondre a consultes o sol·licituds dels usuaris.</li>
        </ul>

        <h2>3. Protecció de dades</h2>
        <p>
          S’apliquen mesures tècniques i organitzatives adequades per garantir la
          seguretat de les dades personals i evitar accessos no autoritzats,
          pèrdua o divulgació.
        </p>

        <h2>4. Comunicació de dades a tercers</h2>
        <p>
          Les dades personals no es comunicaran a tercers, excepte quan sigui
          necessari per obligació legal o amb el consentiment previ de
          l’usuari.
        </p>

        <h2>5. Drets de l’usuari</h2>
        <ul>
          <li>Accedir a les seves dades personals.</li>
          <li>Sol·licitar la rectificació o supressió de les dades.</li>
          <li>Oposar-se o limitar el tractament de les dades.</li>
          <li>Donar-se de baixa de la newsletter en qualsevol moment.</li>
        </ul>

        <h2>6. Canvis en la política de privacitat</h2>
        <p>
          Aquesta política pot actualitzar-se periòdicament. Es recomana
          revisar-la de manera regular per estar informat de possibles canvis.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title:
    "Política de Privacitat | Guillem Vila · Artista, productor musical i enginyer de so",
  meta: [
    {
      name: "description",
      content:
        "Consulta la política de privacitat de la meva web i descobreix com es gestionen i protegeixen les dades personals dels usuaris d’aquest lloc web.",
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

p,
li {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
}

ul {
  padding-left: 1.5rem;
  list-style: disc;
}
</style>
