<template>
  <div class="footer-section">
    <div class="brand">
      <component :is="brand.icon" class="brand-icon" />
      <h3 class="brand-name">{{ brand.name }}</h3>
    </div>
    <p class="brand-description">{{ brand.description }}</p>
    <div class="social-links">
      <a
        v-for="link in socialLinks"
        :key="link.name"
        :href="link.href"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="link.name"
      >
        <component :is="link.icon" />
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  brand: {
    type: Object,
    required: true,
  },
  socialLinks: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%);
}
.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #ff6b35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}
.brand-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin: 0;
}
.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.social-link {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #2d2d2d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b0b0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}
.social-link:hover {
  background: #ff6b35;
  border-color: #ff6b35;
  color: white;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
}
</style>
