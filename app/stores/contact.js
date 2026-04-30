import { defineStore } from "pinia";
import { useApiStore } from "./api";

export const useContactStore = defineStore("contact", () => {
  const loading = ref(false);
  const success = ref(false);
  const message = ref("");

  async function submitContact(payload) {
    const api = useApiStore();

    loading.value = true;
    success.value = false;
    message.value = "";

    try {
      await api.request("/contact", {
        method: "POST",
        body: payload,
      });

      success.value = true;
      message.value =
        "Missatge enviat correctament! Em posaré en contacte amb tu el més aviat possible.";
    } catch (error) {
      console.error("Contact form submission failed:", error);

      success.value = false;
      message.value =
        "Hi ha hagut un error. Si us plau, intenta-ho de nou o contacta'm per email.";

      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    success,
    message,
    submitContact,
  };
});
