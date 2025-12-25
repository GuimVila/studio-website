<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="section-title">Termes i Condicions</h1>
        <p>
          Aquests termes i condicions regulen l'ús del nostre lloc web i
          serveis. En accedir-hi, accepteu aquestes condicions.
        </p>

        <h2>1. Ús del lloc web</h2>
        <ul>
          <li>El lloc web és només per a ús informatiu i professional.</li>
          <li>
            No es permet copiar, distribuir o modificar el contingut sense
            autorització.
          </li>
          <li>
            Els usuaris es comprometen a utilitzar el lloc de manera
            responsable.
          </li>
        </ul>

        <h2>2. Propietat intel·lectual</h2>
        <p>
          Tots els drets de contingut, disseny, imatges i material audiovisual
          pertanyen a Guillem Vila o els seus col·laboradors.
        </p>

        <h2>3. Limitació de responsabilitat</h2>
        <p>
          No ens fem responsables de danys directes o indirectes derivats de
          l'ús del lloc web o contingut.
        </p>

        <h2>4. Enllaços a tercers</h2>
        <p>
          El lloc pot contenir enllaços a pàgines externes. No garantim la seva
          precisió ni responsabilitat sobre aquests continguts.
        </p>

        <h2>5. Modificacions dels termes</h2>
        <p>
          Podem actualitzar aquests termes en qualsevol moment. L'ús continuat
          del lloc implica acceptació dels canvis.
        </p>

        <h2>6. Contacte</h2>
        <p>
          Per qualsevol dubte sobre aquests termes, podeu contactar-me a
          <a href="mailto:info@guillemvila.com">info@guillemvila.com</a>.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
// Cap script necessari
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
