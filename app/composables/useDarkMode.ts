import { ref} from 'vue';

const isDarkMode = ref(true);

export const useDarkMode = () => {
  const initializeDarkMode = () => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      isDarkMode.value = saved === 'true';
    } else {
      isDarkMode.value = true;
    }
    applyDarkMode();
  };

  const applyDarkMode = () => {
    const html = document.documentElement;
    if (isDarkMode.value) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('darkMode', isDarkMode.value.toString());
  };

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    applyDarkMode();
  };

  return {
    isDarkMode,
    toggleDarkMode,
    initializeDarkMode,
  };
};
