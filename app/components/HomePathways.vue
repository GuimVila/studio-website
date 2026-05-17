<template>
  <section class="pathways-section" aria-labelledby="pathways-title">
    <div class="pathways-container">
      <div class="section-kicker">{{ $t("homePathways.eyebrow") }}</div>
      <div class="section-head">
        <h2 id="pathways-title">{{ $t("homePathways.title") }}</h2>
      </div>

      <div class="pathway-grid">
        <LocaleLink
          v-for="item in items"
          :key="item.key"
          class="pathway"
          :to="item.to"
        >
          <span class="pathway-top">
            <span class="pathway-index">{{ item.index }}</span>
            <span class="pathway-icon">
              <UIcon :name="item.icon" aria-hidden="true" />
            </span>
          </span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <span class="pathway-cta">
            {{ item.cta }}
            <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
          </span>
        </LocaleLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n();

const items = computed(() => [
  {
    key: "project",
    index: "01",
    title: t("homePathways.items.project.title"),
    description: t("homePathways.items.project.description"),
    cta: t("homePathways.items.project.cta"),
    icon: "i-lucide-mic-2",
    to: "/contact",
  },
  {
    key: "services",
    index: "02",
    title: t("homePathways.items.services.title"),
    description: t("homePathways.items.services.description"),
    cta: t("homePathways.items.services.cta"),
    icon: "i-lucide-sliders-horizontal",
    to: "/services",
  },
  {
    key: "learn",
    index: "03",
    title: t("homePathways.items.learn.title"),
    description: t("homePathways.items.learn.description"),
    cta: t("homePathways.items.learn.cta"),
    icon: "i-lucide-route",
    to: "/resources/roadmap",
  },
]);
</script>

<style scoped>
.pathways-section {
  background: var(--background);
  padding: clamp(3rem, 7vw, 6rem) 0;
}

.pathways-container {
  width: min(1180px, calc(100% - 2.5rem));
  margin: 0 auto;
}

.section-kicker {
  margin-bottom: 0.7rem;
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.section-head {
  margin-bottom: 1.7rem;
}

.section-head h2 {
  margin: 0;
  max-width: 720px;
}

.section-head p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.02rem;
}

.pathway-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.pathway {
  position: relative;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  padding: 1.35rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  overflow: hidden;
}

.pathway::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--accent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.25s ease;
}

.pathway:hover {
  transform: translateY(-4px);
  border-color: rgba(208, 138, 63, 0.52);
  box-shadow: var(--shadow-1);
}

.pathway:hover::before {
  transform: scaleY(1);
}

.pathway-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.pathway-index {
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 850;
}

.pathway-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--accent);
  background: var(--surface-2);
}

.pathway-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.pathway h3 {
  margin: 1.15rem 0 0.65rem;
  font-size: 1.35rem;
}

.pathway p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.58;
}

.pathway-cta {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  margin-top: auto;
  padding-top: 1.25rem;
  color: var(--accent-light);
  font-weight: 850;
}

.pathway-cta :deep(svg) {
  width: 17px;
  height: 17px;
  transition: transform 0.2s ease;
}

.pathway:hover .pathway-cta :deep(svg) {
  transform: translateX(3px);
}

@media (max-width: 900px) {
  .section-head {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .pathway-grid {
    grid-template-columns: 1fr;
  }

  .pathway {
    min-height: auto;
  }

  .pathway h3 {
    font-size: 1.2rem;
  }
}
</style>
