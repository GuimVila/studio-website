import { ref } from "vue";


/* =========================
   Helpers (fora del composable)
========================= */

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

/* =========================
   Composable
========================= */

export function useContactForm() {
  const supabase = useSupabaseClient();

  const formData = ref<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  // Honeypot anti-spam
  const honeypot = ref("");

  const isSubmitting = ref(false);
  const submitMessage = ref("");
  const submitSuccess = ref(false);

  /* =========================
     Validació
  ========================= */

  function validateForm(): string | null {
    if (formData.value.name.trim().length < 2) {
      return "El nom ha de tenir com a mínim 2 caràcters.";
    }

    if (!emailRegex.test(formData.value.email.trim().toLowerCase())) {
      return "Introdueix una adreça de correu electrònic vàlida.";
    }

    if (!formData.value.service) {
      return "Selecciona un servei d’interès.";
    }

    if (formData.value.message.trim().length < 20) {
      return "El missatge ha de tenir com a mínim 20 caràcters.";
    }

    return null;
  }

  /* =========================
     Submit
  ========================= */

  async function submitForm() {
    if (isSubmitting.value) return;

    // Honeypot → resposta silenciosa
    if (honeypot.value) {
      submitSuccess.value = true;
      submitMessage.value =
        "Missatge enviat correctament! Em posaré en contacte amb tu aviat.";
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      submitSuccess.value = false;
      submitMessage.value = validationError;
      return;
    }

    isSubmitting.value = true;
    submitMessage.value = "";

    try {
      const { error } = await supabase.from("contacts").insert({
        name: formData.value.name.trim(),
        email: formData.value.email.trim().toLowerCase(),
        phone: formData.value.phone?.trim() || null,
        service: formData.value.service,
        message: formData.value.message.trim(),
      });

      if (error) throw error;

      submitSuccess.value = true;
      submitMessage.value =
        "Missatge enviat correctament! Em posaré en contacte amb tu el més aviat possible.";

      // Reset formulari
      formData.value = {
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      };

      honeypot.value = "";
    } catch (err) {
      console.error(err);
      submitSuccess.value = false;
      submitMessage.value =
        "Hi ha hagut un error. Si us plau, intenta-ho de nou o contacta'm per email.";
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    formData,
    honeypot,
    isSubmitting,
    submitMessage,
    submitSuccess,
    submitForm,
  };
}
