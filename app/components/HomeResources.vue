<template>
  <section class="resources-section" aria-labelledby="home-resources-title">
    <div class="resources-container">
      <div class="resources-copy">
        <p class="section-kicker">{{ $t("homeResources.eyebrow") }}</p>
        <h2 id="home-resources-title">{{ $t("homeResources.title") }}</h2>
        <p>{{ $t("homeResources.subtitle") }}</p>

        <div class="resources-actions">
          <LocaleLink to="/resources/roadmap" class="btn-main">
            {{ $t("homeResources.ctaRoadmap") }}
          </LocaleLink>
          <LocaleLink to="/resources" class="btn-ghost">
            {{ $t("homeResources.ctaResources") }}
          </LocaleLink>
        </div>
      </div>

      <div class="featured-list">
        <LocaleLink to="/resources/roadmap" class="roadmap-preview">
          <span class="preview-kicker">{{ $t("homeResources.previewKicker") }}</span>
          <h3>{{ $t("homeResources.previewTitle") }}</h3>
          <p>{{ $t("homeResources.previewText") }}</p>

          <div class="preview-stats">
            <span>
              <strong>{{ categoryCount }}</strong>
              {{ $t("homeResources.metrics.disciplines") }}
            </span>
            <span>
              <strong>{{ nodeCount }}</strong>
              {{ $t("homeResources.metrics.resources") }}
            </span>
            <span>
              <strong>{{ estimatedHours }}h</strong>
              {{ $t("homeResources.metrics.learning") }}
            </span>
          </div>
        </LocaleLink>

        <LocaleLink
          v-for="item in items"
          :key="item.key"
          class="featured-resource"
          :to="item.to"
        >
          <span>{{ item.label }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </LocaleLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import roadmap from "../../data/roadmap.json";

const { t } = useI18n();

const roadmapNodes = computed(() => roadmap.nodes || []);
const nodeCount = computed(() => roadmapNodes.value.length);
const categoryCount = computed(
  () => new Set(roadmapNodes.value.map((node) => node.category)).size
);
const estimatedHours = computed(() => {
  const minutes = roadmapNodes.value.reduce(
    (total, node) => total + Number(node.estMinutes || 0),
    0
  );
  return Math.max(1, Math.round(minutes / 60));
});

const items = computed(() => [
  {
    key: "start",
    label: t("homeResources.items.start.label"),
    title: t("homeResources.items.start.title"),
    description: t("homeResources.items.start.description"),
    to: "/resources/fonaments/ft-01-que-es-el-so-ona-fase-pressio",
  },
  {
    key: "mix",
    label: t("homeResources.items.mix.label"),
    title: t("homeResources.items.mix.title"),
    description: t("homeResources.items.mix.description"),
    to: "/resources/mescla/me-01-objectius-de-mescla-traduccio-i-intencio",
  },
  {
    key: "sound",
    label: t("homeResources.items.sound.label"),
    title: t("homeResources.items.sound.title"),
    description: t("homeResources.items.sound.description"),
    to: "/resources/disseny-de-so/ds-01-ones-basiques-i-espectre-sine-saw-square-noise",
  },
]);
</script>

<style scoped>
.resources-section {
  background: var(--surface-2);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: clamp(3.5rem, 8vw, 7rem) 0;
}

.resources-container {
  width: min(1180px, calc(100% - 2.5rem));
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(320px, 1fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}

.section-kicker {
  margin: 0 0 0.75rem;
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.resources-copy h2 {
  margin: 0 0 1rem;
}

.resources-copy p:not(.section-kicker) {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.03rem;
}

.resources-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-main,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0.82rem 1.1rem;
  border-radius: 8px;
  font-weight: 850;
}

.btn-main {
  background: var(--accent);
  color: #0a0a0a;
}

.btn-ghost {
  border: 1px solid var(--border-strong);
  color: var(--text);
}

.featured-list {
  display: grid;
  gap: 0.8rem;
}

.roadmap-preview {
  display: block;
  padding: 1.25rem;
  border: 1px solid rgba(208, 138, 63, 0.38);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(208, 138, 63, 0.14), transparent 58%),
    var(--surface);
  color: var(--text);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.roadmap-preview:hover {
  transform: translateY(-3px);
  border-color: rgba(208, 138, 63, 0.62);
  box-shadow: var(--shadow-1);
}

.preview-kicker {
  display: block;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.roadmap-preview h3 {
  margin: 0.5rem 0 0.45rem;
  font-size: 1.3rem;
}

.roadmap-preview p {
  margin: 0;
  color: var(--text-secondary);
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin-top: 1rem;
}

.preview-stats span {
  display: block;
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.25;
}

.preview-stats strong {
  display: block;
  color: var(--accent);
  font-size: 1.25rem;
  line-height: 1.1;
}

.featured-resource {
  display: block;
  padding: 1.15rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
}

.featured-resource:hover {
  transform: translateX(4px);
  border-color: rgba(208, 138, 63, 0.55);
}

.featured-resource span {
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.featured-resource h3 {
  margin: 0.45rem 0 0.35rem;
  font-size: 1.12rem;
}

.featured-resource p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

@media (max-width: 900px) {
  .resources-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .resources-actions {
    display: grid;
  }

  .btn-main,
  .btn-ghost {
    width: 100%;
  }

  .preview-stats {
    grid-template-columns: 1fr;
  }
}
</style>
