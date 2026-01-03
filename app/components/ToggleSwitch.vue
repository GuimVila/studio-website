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
import { ref } from "vue";

const isOn = ref(false);

const emit = defineEmits(["toggle"]);

const toggleSwitch = () => {
  isOn.value = !isOn.value;
  emit("toggle", isOn.value);
};
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
  background-color: #D08A3F;
  border-color: #D08A3F;
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
