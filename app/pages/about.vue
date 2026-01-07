<template>
  <div class="page-wrapper">
    <div class="content-wrapper">
      <section class="section">
        <h1 class="section-title heading-accent">Sobre mi</h1>
        <p class="section-subtitle">
          Una mica sobre mi i la meva trajectòria en el món de la música
        </p>
      </section>

      <section class="about-paragraph">
        <p
          v-for="(text, index) in aboutParagraphs"
          :key="index"
          class="section-subtitle"
        >
          {{ text }}
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
const aboutParagraphs = [
  `Sóc Guillem Vila, músic, productor i enginyer de so nascut a Arenys de Mar. Durant els meus primers anys en el món de la música, em vaig dedicar a la formació constant entre el Taller de Músics i l'AULA del Liceu i al treball de camp en estudis i projectes locals. Vaig ser lletrista i compositor dels dos primers discos del grup de rock Exceso, compartint escenari amb grups com La Fuga, Poncho K, Burning, Siniestro Total o Reincidentes.`,

  `Al llarg de la segona fase de la meva formació, vaig cursar el Bachelor en Professional Music al Berklee College of Music (Boston), amb mencions en Music Production & Engineering i Performance, complementat amb el minor en Music Technology & Innovation a València. A Boston, vaig tenir l’oportunitat d’aprendre de professors com Sean McLaughlin, Lyle Brewer, Colin Sapp, Dave Fiuczynski, Scott DeOgburn i Steve Rochinsky, experiència que em va donar eines per combinar rigor tècnic i expressió artística de manera efectiva.`,

  `A continuació, després d’una breu etapa a Igloo Music a Califòrnia, vaig tornar a Catalunya, on compagino la producció musical, la composició i l’enginyeria de so amb la docència. He estat professor a Microfusa i, des de fa cinc anys, treballo com a professor de música d'educació secundària, mentre continuo estudiant i perfeccionant tècniques de guitarra, baix, veu, mescla, mastering, producció i disseny de so.`,

  `Com a artista, busco crear un llenguatge propi que combini influències diverses d'autors com Jacob Collier, Billie Eilish, Bob Dylan, John Mayer o Bon Iver. M’interessa una mirada minimalista i una música on tècnica i emoció conviuen, amb l’honestedat artística i l’expressió personal com a valors centrals. Aquesta web és l’espai on mostro totes aquestes facetes: músic, productor, enginyer i docent, amb la música com a eix central del meu treball i la meva passió.`,
];

useHead({
  title:
    "Sobre mi | Guillem Vila · Artista, productor musical i enginyer de so",
  meta: [
    {
      name: "description",
      content:
        "Em dic Guillem Vila i sóc artista, productor musical i enginyer de so. Tinc experiència en gravació, mescla i producció per a artistes i projectes professionals.",
    },
  ],
});
</script>

<style scoped>
.about-paragraph {
  padding: 0rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}
</style>
