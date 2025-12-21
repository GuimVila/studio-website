<template>
  <div>
    <div style="padding-top: 100px">
      <section class="section">
        <h1 class="section-title">Subscriu-te</h1>
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
          "
        >
          Subscriu-te al meu butlletí per rebre les últimes novetats, tutorials
          i ofertes especials directament al teu correu electrònic.
        </p>
      </section>

      <div class="subscribe-form">
        <input type="email" placeholder="Introdueix el teu correu electrònic" >
        <button>Subscriu-te</button>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.subscribe-form {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
.subscribe-form input {
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border: 1px solid var(--text-secondary);
  border-radius: 5px;
  width: 300px;
  background: var(--secondary);
  color: var(--text);
}
.subscribe-form button {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background: var(--accent);
  color: var(--text);
  cursor: pointer;
}
.subscribe-form button:hover {
  background: darken(var(--accent), 10%);
}
</style>
