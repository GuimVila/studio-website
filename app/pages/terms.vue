<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="section-title heading-accent">Termes i Condicions</h1>
        <p>
          Aquests termes i condicions regulen l’ús d’aquest lloc web. En
          accedir-hi i navegar-hi, l’usuari accepta aquestes condicions.
        </p>

        <h2>1. Ús del lloc web</h2>
        <ul>
          <li>El lloc web té finalitat informativa i professional.</li>
          <li>
            L’usuari es compromet a utilitzar el lloc de manera lícita,
            responsable i sense causar danys a tercers ni al funcionament del
            servei.
          </li>
        </ul>

        <h2>2. Propietat intel·lectual</h2>
        <p>
          Els continguts, dissenys, imatges i material audiovisual d’aquest lloc
          web són titularitat de Guillem Vila o dels seus col·laboradors, i
          estan protegits per la normativa de propietat intel·lectual. No es
          permet la reproducció, distribució o transformació sense autorització.
        </p>

        <h2>3. Limitació de responsabilitat</h2>
        <p>
          Es procura mantenir la informació actualitzada i el servei operatiu,
          però no es garanteix la disponibilitat ininterrompuda ni l’absència
          d’errors. No s’assumeix responsabilitat per danys derivats de l’ús del
          lloc web, en la mesura permesa per la llei.
        </p>

        <h2>4. Enllaços a tercers</h2>
        <p>
          El lloc pot contenir enllaços a pàgines externes. No es controla ni es
          garanteix el seu contingut, exactitud o polítiques, i no s’assumeix
          cap responsabilitat per aquests webs de tercers.
        </p>

        <h2>5. Modificacions dels termes</h2>
        <p>
          Es poden actualitzar aquests termes en qualsevol moment. L’ús
          continuat del lloc implica acceptació dels canvis.
        </p>

        <h2>6. Legislació aplicable i jurisdicció</h2>
        <p>
          Aquests termes es regeixen per la legislació espanyola. En cas de
          disputa, les parts se sotmetran als jutjats i tribunals que resultin
          competents segons la normativa aplicable.
        </p>

        <h2>7. Contacte</h2>
        <p>
          Per qualsevol dubte sobre aquests termes, pots contactar-me a
          <a href="mailto:info@guillemvila.com">info@guillemvila.com</a>.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title:
    "Termes i Condicions | Guillem Vila · Artista, productor musical i enginyer de so",
  meta: [
    {
      name: "description",
      content:
        "Consulta els termes i condicions del lloc web de Guillem Vila: ús del lloc, propietat intel·lectual, responsabilitat, enllaços a tercers i legislació aplicable.",
    },
  ],
});
</script>

<style scoped>
h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
p,
li {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
}

ul {
  padding-left: 1.5rem;
  list-style: none;
}

a {
  color: inherit;
  text-decoration: underline;
}
</style>
