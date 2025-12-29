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

    try {
      const supabase = useSupabaseClient();

      // Token únic per confirmar (doble opt-in)
      const token =
        (globalThis.crypto?.randomUUID?.() as string | undefined) ??
        `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const expiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString();

      // 1) Guardar pending a Supabase
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: cleanEmail,
          confirmation_token: token,
          confirmation_expires_at: expiresAt,
          is_confirmed: false,
        });

      // UX silenciosa (duplicats inclosos)
      if (insertError) {
        console.error("[newsletter insert error]", insertError);
        success.value = true;
        message.value =
          "Si aquest correu ja està registrat, revisa la teva safata d’entrada.";
        return;
      }

      // 2) Enviar email via backend (Resend) amb token
      const res = await $fetch<{ ok: boolean }>("/api/newsletter/subscribe", {
        method: "POST",
        body: { email: cleanEmail, token },
      });

      // Encara que el backend falli, mantenim UX segura
      if (!res?.ok) {
        success.value = true;
        message.value =
          "Si aquest correu és vàlid, revisa la teva safata d’entrada.";
        return;
      }

      success.value = true;
      message.value = "Revisa el teu correu per confirmar la subscripció.";
      email.value = "";
    } catch (e) {
      console.error("[newsletter subscribe error]", e);
      success.value = true;
      message.value =
        "Si aquest correu és vàlid, revisa la teva safata d’entrada.";
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
