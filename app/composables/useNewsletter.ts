import { ref } from "vue";
import { useNewsletterStore } from "../stores/newsletter";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type NewsletterResponse = {
  message?: string;
};

export function useNewsletter() {
  const email = ref("");
  const honeypot = ref("");

  const isSubmitting = ref(false);
  const submitSuccess = ref(false);
  const submitMessage = ref("");

  function validateEmail(): string | null {
    const cleanEmail = email.value.trim().toLowerCase();

    if (!cleanEmail) {
      return "Introdueix el teu correu electrònic.";
    }

    if (!emailRegex.test(cleanEmail)) {
      return "Introdueix una adreça de correu electrònic vàlida.";
    }

    return null;
  }

  async function subscribe() {
    if (isSubmitting.value) return;

    if (honeypot.value) {
      submitSuccess.value = true;
      submitMessage.value =
        "T'he enviat un correu per confirmar la subscripció.";
      return;
    }

    const validationError = validateEmail();

    if (validationError) {
      submitSuccess.value = false;
      submitMessage.value = validationError;
      return;
    }

    isSubmitting.value = true;
    submitMessage.value = "";

    const newsletterStore = useNewsletterStore();

    try {
      const response = (await newsletterStore.subscribe(
        email.value.trim().toLowerCase(),
        honeypot.value
      )) as NewsletterResponse | null;

      submitSuccess.value = true;
      submitMessage.value =
        response?.message ||
        newsletterStore.message ||
        "T'he enviat un correu per confirmar la subscripció.";

      email.value = "";
      honeypot.value = "";
    } catch (err) {
      console.error(err);

      submitSuccess.value = false;
      submitMessage.value =
        newsletterStore.message ||
        "No s'ha pogut completar la subscripció. Torna-ho a provar més tard.";
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    email,
    honeypot,
    isSubmitting,
    success: submitSuccess,
    message: submitMessage,
    submitSuccess,
    submitMessage,
    subscribe,
  };
}
