import { ref } from "vue";

type Consent = "accepted" | "rejected" | null;

const STORAGE_KEY = "cookie-consent";

const consent = ref<Consent>(null);

// Inicialitzar des de localStorage (client-only)
if (import.meta.client) {
  const stored = localStorage.getItem(STORAGE_KEY) as Consent;
  consent.value = stored;
}

export function useCookieConsent() {
  const accept = () => {
    consent.value = "accepted";
    localStorage.setItem(STORAGE_KEY, "accepted");
  };

  const reject = () => {
    consent.value = "rejected";
    localStorage.setItem(STORAGE_KEY, "rejected");
  };

  return {
    consent,
    accept,
    reject,
  };
}
