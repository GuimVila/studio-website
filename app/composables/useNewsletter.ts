import { ref } from "vue";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type SubscribeResponse = {
  ok: boolean;
  error?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSubscribeResponse(value: unknown): value is SubscribeResponse {
  if (!isRecord(value)) return false;
  return typeof value.ok === "boolean";
}

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
      const res = await $fetch<SubscribeResponse>("/api/newsletter/subscribe", {
        method: "POST",
        body: {
          email: cleanEmail,
          honeypot: honeypot.value,
        },
      });

      // UX silenciosa: sempre “ok”
      if (isSubscribeResponse(res) && res.ok) {
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
