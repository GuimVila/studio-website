import { ref } from "vue";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function useNewsletter() {
  const email = ref("");
  const honeypot = ref("");
  const isSubmitting = ref(false);
  const message = ref("");
  const success = ref(false);

  async function subscribe() {
    if (isSubmitting.value) return;

    // Honeypot (bots)
    if (honeypot.value) {
      success.value = true;
      message.value = "Revisa el teu correu per confirmar la subscripció.";
      return;
    }

    const cleanEmail = email.value.trim().toLowerCase();

    if (!cleanEmail) {
      success.value = false;
      message.value = "Introdueix una adreça de correu electrònic.";
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      success.value = false;
      message.value = "Introdueix una adreça de correu electrònic vàlida.";
      return;
    }

    isSubmitting.value = true;
    message.value = "";

    try {
      // IMPORTANT: ja NO fem supabase client-side
      const res = await $fetch("/api/newsletter/subscribe", {
        method: "POST",
        body: {
          email: cleanEmail,
          honeypot: honeypot.value,
        },
      });

      // UX silenciosa: sempre “ok”
      if (res?.ok) {
        success.value = true;
        message.value = "Revisa el teu correu per confirmar la subscripció.";
        email.value = "";
        honeypot.value = "";
      } else {
        success.value = true;
        message.value = "Revisa el teu correu per confirmar la subscripció.";
      }
    } catch (e) {
      console.error("[newsletter subscribe fetch error]", e);
      // No donem pistes a bots / no “trenquem” UX
      success.value = true;
      message.value = "Revisa el teu correu per confirmar la subscripció.";
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    email,
    honeypot,
    isSubmitting,
    message,
    success,
    subscribe,
  };
}
