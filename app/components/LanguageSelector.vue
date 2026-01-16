<template>
  <div class="language-selector">
    <label class="sr-only" for="lang">{{ $t("nav.language") }}</label>

    <select
      id="lang"
      class="lang-select"
      :value="current"
      :aria-label="$t('nav.language')"
      @change="onChange"
    >
      <option value="ca">CA</option>
      <option value="es">ES</option>
      <option value="en">EN</option>
    </select>
  </div>
</template>

<script setup>
const { locale, setLocale } = useI18n();

const current = computed(() => String(locale.value || "ca"));

async function onChange(e) {
  const value = String(e?.target?.value || "ca");
  await setLocale(value);
}
</script>

<style scoped>
.language-selector {
  display: inline-flex;
  align-items: center;
}

.lang-select {
  height: 38px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  cursor: pointer;
  line-height: 1;
}

.lang-select option {
  color: var(--text);
  background: var(--surface);
}

.lang-select:focus {
  outline: none;
  border-color: rgba(208, 138, 63, 0.65);
  box-shadow: 0 0 0 3px rgba(208, 138, 63, 0.2);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
