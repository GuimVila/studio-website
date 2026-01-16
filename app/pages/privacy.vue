<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="section-title heading-accent">{{ t("privacy.title") }}</h1>

        <!-- Controller -->
        <h2>{{ t("privacy.sections.controller.title") }}</h2>
        <p>
          {{ t("privacy.sections.controller.p1") }}
          <a href="mailto:info@guillemvila.com">info@guillemvila.com</a>.
        </p>

        <!-- Data -->
        <h2>{{ t("privacy.sections.data.title") }}</h2>
        <ul>
          <li v-for="(item, idx) in dataItems" :key="'data-' + idx">
            <strong>{{ rt(item.label) }}:</strong> {{ rt(item.text) }}
          </li>
        </ul>

        <!-- Purposes -->
        <h2>{{ t("privacy.sections.purposes.title") }}</h2>
        <ul>
          <li v-for="(item, idx) in purposeItems" :key="'purp-' + idx">
            <strong>{{ rt(item.bold) }}</strong>
            {{ rt(item.text) }}
            <em>{{ rt(item.basis) }}</em
            >.
          </li>
        </ul>
        <p>{{ t("privacy.sections.purposes.p1") }}</p>

        <!-- Retention -->
        <h2>{{ t("privacy.sections.retention.title") }}</h2>
        <ul>
          <li v-for="(item, idx) in retentionItems" :key="'ret-' + idx">
            <strong>{{ rt(item.label) }}:</strong> {{ rt(item.text) }}
          </li>
        </ul>

        <!-- Processors -->
        <h2>{{ t("privacy.sections.processors.title") }}</h2>
        <p>{{ t("privacy.sections.processors.p1") }}</p>
        <ul>
          <li v-for="(p, idx) in providers" :key="'prov-' + idx">
            <strong>{{ rt(p.name) }}</strong> {{ rt(p.note) }}
          </li>
        </ul>

        <!-- Intl -->
        <h2>{{ t("privacy.sections.intl.title") }}</h2>
        <p>{{ t("privacy.sections.intl.p1") }}</p>

        <!-- Rights -->
        <h2>{{ t("privacy.sections.rights.title") }}</h2>
        <p>
          {{ t("privacy.sections.rights.p1") }}
          <a href="mailto:info@guillemvila.com">info@guillemvila.com</a>.
        </p>
        <ul>
          <li v-for="(line, idx) in rightsItems" :key="'right-' + idx">
            {{ rt(line) }}
          </li>
        </ul>
        <p>{{ t("privacy.sections.rights.p2") }}</p>

        <!-- Unsubscribe -->
        <h2>{{ t("privacy.sections.unsubscribe.title") }}</h2>
        <p>
          {{ t("privacy.sections.unsubscribe.p1") }}
          <a href="mailto:info@guillemvila.com">info@guillemvila.com</a>.
        </p>

        <!-- Changes -->
        <h2>{{ t("privacy.sections.changes.title") }}</h2>
        <p>{{ t("privacy.sections.changes.p1") }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "#i18n";

const { t, tm, rt } = useI18n();

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

function asObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

const dataItems = computed(() =>
  asArray(tm("privacy.sections.data.items")).map(asObject)
);

const purposeItems = computed(() =>
  asArray(tm("privacy.sections.purposes.items")).map(asObject)
);

const retentionItems = computed(() =>
  asArray(tm("privacy.sections.retention.items")).map(asObject)
);

const providers = computed(() =>
  asArray(tm("privacy.sections.processors.providers")).map(asObject)
);

const rightsItems = computed(() =>
  asArray(tm("privacy.sections.rights.items"))
);

useHead(() => ({
  title: t("privacy.seo.title"),
  meta: [{ name: "description", content: t("privacy.seo.description") }],
}));
</script>

<style scoped>
h1 {
  margin-bottom: 3rem;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

p,
li {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
  margin-top: 1rem;
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
