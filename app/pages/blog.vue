<template>
  <div>
    <NavigationMenu />

    <div style="padding-top: 100px">
      <section class="section">
        <h1 class="section-title">Blog</h1>
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
          "
        >
          Aprèn producció, mescla, instruments i més amb els nostres tutorials i
          recursos
        </p>

        <div
          style="
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 3rem;
          "
        >
          <button
            v-for="cat in categories"
            :key="cat"
            :class="[
              'btn',
              selectedCategory === cat ? 'btn-primary' : 'btn-secondary',
            ]"
            style="padding: 0.7rem 1.5rem"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="tutorials-grid">
          <div
            v-for="tutorial in filteredTutorials"
            :key="tutorial.id"
            class="tutorial-card"
            @click="openTutorial(tutorial)"
          >
            <div class="tutorial-thumbnail">{{ tutorial.icon }}</div>
            <div class="tutorial-content">
              <span class="tutorial-category">{{ tutorial.categoria }}</span>
              <h3>{{ tutorial.titol }}</h3>
              <p>{{ tutorial.descripcio }}</p>
              <div class="tutorial-meta">
                <span>⏱️ {{ tutorial.duracio }}</span>
                <span>📅 {{ tutorial.data }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="filteredTutorials.length === 0"
          style="
            text-align: center;
            padding: 4rem;
            color: var(--text-secondary);
          "
        >
          <p style="font-size: 1.2rem">
            No hi ha tutorials disponibles en aquesta categoria.
          </p>
        </div>
      </section>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import NavigationMenu from "~/components/NavigationMenu.vue";
import AppFooter from "~/components/AppFooter.vue";

const selectedCategory = ref("Tots");

const categories = ref([
  "Tots",
  "Producció",
  "Mescla",
  "Mastering",
  "Guitarra",
  "Baix",
  "Teoria",
]);

const tutorials = ref([
  {
    id: 1,
    titol: "Introducció a la Mescla: Conceptes Bàsics",
    descripcio:
      "Aprèn els fonaments de la mescla: guany, equalització, compressió i panoràmica.",
    categoria: "Mescla",
    icon: "🎚️",
    duracio: "15 min",
    data: "15 Nov 2024",
    tipus: "video",
  },
  {
    id: 2,
    titol: "Com Gravar Guitarres Elèctriques",
    descripcio:
      "Tècniques de microfonació, col·locació i processament per aconseguir el millor so.",
    categoria: "Guitarra",
    icon: "🎸",
    duracio: "22 min",
    data: "10 Nov 2024",
    tipus: "video",
  },
  {
    id: 3,
    titol: "Mastering per Streaming: Spotify i Apple Music",
    descripcio:
      "Optimitza les teves cançons per les plataformes de streaming amb els nivells correctes.",
    categoria: "Mastering",
    icon: "💎",
    duracio: "18 min",
    data: "5 Nov 2024",
    tipus: "video",
  },
  {
    id: 4,
    titol: "Producció de Baix: Sons Moderns",
    descripcio:
      "Com aconseguir sons de baix potents i moderns per hip-hop, trap i electrònica.",
    categoria: "Baix",
    icon: "🎵",
    duracio: "20 min",
    data: "1 Nov 2024",
    tipus: "video",
  },
  {
    id: 5,
    titol: "Teoria Musical per Productors",
    descripcio:
      "Escales, acords i progressions harmòniques explicades de forma pràctica.",
    categoria: "Teoria",
    icon: "📚",
    duracio: "30 min",
    data: "28 Oct 2024",
    tipus: "article",
  },
  {
    id: 6,
    titol: "Compressió Paral·lela en Bateries",
    descripcio:
      "Tècnica avançada per aconseguir bateries amb punch i caràcter.",
    categoria: "Mescla",
    icon: "🥁",
    duracio: "12 min",
    data: "25 Oct 2024",
    tipus: "video",
  },
  {
    id: 7,
    titol: "Arranjaments: Del Demo a la Cançó Final",
    descripcio:
      "Aprèn a estructurar i arreglar les teves idees per crear cançons completes.",
    categoria: "Producció",
    icon: "🎹",
    duracio: "25 min",
    data: "20 Oct 2024",
    tipus: "video",
  },
  {
    id: 8,
    titol: "Tècniques de Fingerstyle per Baix",
    descripcio:
      "Millora la teva tècnica de dits i aconsegueix un so més dinàmic.",
    categoria: "Baix",
    icon: "🎸",
    duracio: "18 min",
    data: "15 Oct 2024",
    tipus: "video",
  },
]);

const filteredTutorials = computed(() => {
  if (selectedCategory.value === "Tots") return tutorials.value;
  return tutorials.value.filter((t) => t.categoria === selectedCategory.value);
});

function openTutorial(tutorial) {
  alert(
    `Tutorial: ${tutorial.titol}\n\nAquí s'obriria el contingut complet del tutorial. En una versió real, això enllaçaria a una pàgina de detall o reproduiria el vídeo.`
  );
}
</script>
