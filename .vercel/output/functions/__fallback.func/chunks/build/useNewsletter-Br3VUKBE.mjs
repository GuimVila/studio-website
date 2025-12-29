import { ref } from 'vue';
import { u as useSupabaseClient } from './useSupabaseClient-DykwVqLQ.mjs';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function useNewsletter() {
  const email = ref("");
  const honeypot = ref("");
  const isSubmitting = ref(false);
  const message = ref("");
  const success = ref(false);
  async function subscribe() {
    if (isSubmitting.value) return;
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
    const supabase = useSupabaseClient();
    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1e3
    ).toISOString();
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: cleanEmail,
      confirmation_expires_at: expiresAt,
      is_confirmed: false
    });
    if (error) {
      success.value = true;
      message.value = "Si aquest correu ja està registrat, revisa la teva safata d’entrada.";
    } else {
      success.value = true;
      message.value = "Revisa el teu correu per confirmar la subscripció.";
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
    subscribe
  };
}

export { useNewsletter as u };
//# sourceMappingURL=useNewsletter-Br3VUKBE.mjs.map
