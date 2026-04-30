import { defineStore } from "pinia";
import { useApiStore } from "./api";

export const useNewsletterStore = defineStore("newsletter", () => {
  const loading = ref(false);
  const success = ref(false);
  const message = ref("");

  async function subscribe(email, honeypot = "") {
    const api = useApiStore();

    loading.value = true;
    success.value = false;
    message.value = "";

    try {
      const response = await api.request("/newsletter/subscribe", {
        method: "POST",
        body: {
          email,
          honeypot,
        },
      });

      if (response?.success === false) {
        throw new Error(response?.message || "Newsletter subscription failed.");
      }

      success.value = true;
      message.value =
        response?.message ||
        "T'he enviat un correu per confirmar la subscripció.";

      return response;
    } catch (error) {
      console.error("Newsletter subscription failed:", error);

      success.value = false;
      message.value =
        "No s'ha pogut completar la subscripció. Torna-ho a provar més tard.";

      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function confirm(token) {
    const api = useApiStore();

    return await api.request(`/newsletter/confirm/${token}`, {
      method: "GET",
    });
  }

  return {
    loading,
    success,
    message,
    subscribe,
    confirm,
  };
});
