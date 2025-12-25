<template>
  <div>
    <div class="content-wrapper">
      <section class="about-header">
        <h1 class="section-title">Sobre mi</h1>
        <p class="section-subtitle">
          Una mica sobre mi i la meva trajectòria en el món de la música.
        </p>
      </section>

      <section class="about-paragraph">
        <p
          v-for="(text, index) in aboutParagraphs"
          :key="index"
          class="section-subtitle separated-paragraph"
        >
          {{ text }}
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
const aboutParagraphs = [
  `Sóc en Guillem Vila, músic, productor i enginyer de so nascut a Arenys de Mar. Durant els meus primers anys professionals em vaig dedicar a la formació constant i al treball de camp en estudis i projectes locals, consolidant coneixements en producció, guitarra i enginyeria de so que més endavant em portarien a formar-me a Berklee College of Music.`,

  `Als trenta anys vaig cursar el Bachelor en Professional Music a Berklee College of Music (Boston), amb mencions en Music Production & Engineering i Performance, complementat amb el minor en Music Technology & Innovation a València. A Berklee vaig tenir l’oportunitat d’aprendre de professors com Sean McLaughlin, Lyle Brewer, Colin Sapp, Dave Fiuczynski, Scott DeOgburn i Steve Rochinsky, experiència que em va donar eines per combinar rigor tècnic i expressió artística de manera efectiva.`,

  `Després d’una breu etapa a Igloo Music a Califòrnia, vaig tornar a Catalunya, on compagino la producció musical, la composició i l’enginyeria de so amb la docència. He estat professor a Microfusa i, des de fa cinc anys, treballo com a docent d’ESO, mentre continuo estudiant i perfeccionant tècniques de guitarra, baix, veu, mescla, mastering, producció i disseny de so.`,

  `Com a artista, busco crear un llenguatge propi que combina influències diverses, com Jacob Collier, Billie Eilish, Bob Dylan, John Mayer, Bon Iver i la cançó catalana. M’interessa una mirada minimalista i una música on tècnica i emoció conviuen, amb l’honestedat artística i l’expressió personal com a valors centrals. Aquesta web és l’espai on mostro totes aquestes facetes: músic, productor, enginyer i docent, amb la música com a eix central del meu treball i la meva passió.`,
];
</script>

<style scoped>
.content-wrapper {
  padding-top: 100px;
}

.about-header {
  padding: 6rem 2rem 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.about-paragraph {
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 0rem;
}

.separated-paragraph {
  margin-top: 2rem;
}

h1 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 3rem);
  font-weight: 900;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #ff6b35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
