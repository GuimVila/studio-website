<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="section-title">Política de Privacitat</h1>
        <p>
          Aquesta Política de Privacitat descriu com recopilem, utilitzem i
          protegim la informació personal dels usuaris del nostre lloc web.
        </p>

        <h2>1. Informació que recopilem</h2>
        <ul>
          <li>Nom i correu electrònic quan subscriviu la newsletter.</li>
          <li>Dades de navegació (cookies, IP, preferències).</li>
          <li>
            Comentaris o missatges enviats a través del formulari de contacte.
          </li>
        </ul>

        <h2>2. Ús de la informació</h2>
        <ul>
          <li>Enviar novetats, ofertes i tutorials a la newsletter.</li>
          <li>Millorar la nostra pàgina web i serveis.</li>
          <li>Respondre a consultes i demandes dels usuaris.</li>
        </ul>

        <h2>3. Protecció de dades</h2>
        <p>
          Implementem mesures tècniques i organitzatives per protegir la
          informació personal contra accessos no autoritzats, alteracions o
          divulgacions.
        </p>

        <h2>4. Compartir informació</h2>
        <p>
          No compartim la informació personal amb tercers sense el consentiment
          explícit de l'usuari, excepte per obligacions legals.
        </p>

        <h2>5. Drets de l'usuari</h2>
        <ul>
          <li>Accedir, corregir o eliminar les seves dades personals.</li>
          <li>Donar-se de baixa de la newsletter en qualsevol moment.</li>
          <li>Contactar-nos per qualsevol consulta sobre privacitat.</li>
        </ul>

        <h2>6. Canvis en la política</h2>
        <p>
          Podem actualitzar aquesta política periòdicament. Es recomana
          revisar-la regularment.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
// Cap script específic necessari
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
