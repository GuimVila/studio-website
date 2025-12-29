<template>
  <div style="padding-top: 100px">
    <section class="section">
      <h1 class="section-title">Confirmació de subscripció</h1>

      <p
        style="
          text-align: center;
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        "
      >
        <span v-if="status === 'loading'">
          Estem confirmant la teva subscripció...
        </span>

        <span v-else-if="status === 'success'">
          Perfecte. Ja estàs subscrit a la newsletter.
        </span>

        <span v-else-if="status === 'missing'">
          Falta el token de confirmació. Torna a obrir l’enllaç del correu.
        </span>

        <span v-else>
          Hi ha hagut un error confirmant la subscripció. Torna-ho a intentar.
        </span>
      </p>

      <div style="display: flex; justify-content: center">
        <NuxtLink class="btn" to="/">Tornar a l'inici</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const status = ref("loading");

onMounted(async () => {
  const route = useRoute();
  const token = route.query.token;

  if (!token || typeof token !== "string") {
    status.value = "missing";
    return;
  }

  try {
    const res = await $fetch("/api/newsletter/confirm", {
      method: "POST",
      body: { token },
    });

    status.value = res && res.ok ? "success" : "error";
  } catch (e) {
    console.error("[newsletter confirm error]", e);
    status.value = "error";
  }
});
</script>

<style scoped>
.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  background: var(--accent);
  color: var(--text);
  text-decoration: none;
}
.btn:hover {
  filter: brightness(1.05);
}
</style>
