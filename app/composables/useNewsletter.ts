import { ref } from "vue";

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

    // Email buit
    if (!cleanEmail) {
      success.value = false;
      message.value = "Introdueix una adreça de correu electrònic.";
      return;
    }

    // Email mal format
    if (!emailRegex.test(cleanEmail)) {
      success.value = false;
      message.value = "Introdueix una adreça de correu electrònic vàlida.";
      return;
    }

    isSubmitting.value = true;
    message.value = "";

    const supabase = useSupabaseClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: cleanEmail });

    if (error) {
      // UX silenciosa (duplicats inclosos)
      success.value = true;
      message.value =
        "Si aquest correu ja està registrat, revisa la teva safata d’entrada.";
    } else {
      success.value = true;
      message.value =
        "Revisa el teu correu per confirmar la subscripció.";
      email.value = "";
    }

    isSubmitting.value = false;
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
