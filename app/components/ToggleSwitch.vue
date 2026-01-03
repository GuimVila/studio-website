<template>
  <button
    :class="['toggle-container', isOn ? 'on' : 'off']"
    :aria-label="isOn ? 'Dark mode enabled' : 'Light mode enabled'"
    @click="toggleSwitch"
  >
    <div class="toggle-handle" />
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";
const isOn = ref(true);

function applyTheme(isDark) {
  const theme = isDark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function toggleSwitch() {
  isOn.value = !isOn.value;
  applyTheme(isOn.value);
}

onMounted(() => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") {
    isOn.value = saved === "dark";
    applyTheme(isOn.value);
    return;
  }

  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  )?.matches;
  isOn.value = !!prefersDark;
  applyTheme(isOn.value);
});
</script>

<style scoped>
.toggle-container {
  width: 45px;
  height: 23px;
  background-color: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  padding: 3px;
  align-items: center;
  transition: background-color 0.3s ease;
  position: relative;
}

.toggle-container.on {
  background-color: #d08a3f;
  border-color: #d08a3f;
}

.toggle-container.off {
  justify-content: flex-start;
}

.toggle-container.on {
  justify-content: flex-end;
}

.toggle-handle {
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
