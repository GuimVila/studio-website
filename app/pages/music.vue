<template>
  <div>
    <div style="padding-top: 100px">
      <section class="section">
        <h1 class="section-title">Música</h1>
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 4rem;
          "
        >
          Escolta algunes de les meves creacions musicals, col.laboracions i
          projectes destacats.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Música | Guillem Vila · Artista, productor musical i enginyer de so",
  meta: [
    {
      name: "description",
      content:
        "Escolta la meva música i projectes destacats com a artista. Descobreix les meves creacions musicals i col·laboracions professionals.",
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
  background: linear-gradient(135deg, #ffffff 0%, #d08a3f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
