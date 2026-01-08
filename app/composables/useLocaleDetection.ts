type SupportedLocale = "ca" | "es" | "en";

const SUPPORTED_LOCALES: SupportedLocale[] = ["ca", "es", "en"];
const DEFAULT_LOCALE: SupportedLocale = "ca";

function normalizeToSupported(
  tag: string | undefined | null
): SupportedLocale | null {
  if (!tag) return null;

  // Examples: "ca-ES" -> "ca", "en" -> "en"
  const base = tag.toLowerCase().split("-")[0] as SupportedLocale;
  return (SUPPORTED_LOCALES as string[]).includes(base) ? base : null;
}

export function useLocaleDetection() {
  const timeZone = ref<string | null>(null);
  const languageTag = ref<string | null>(null);
  const region = ref<string | null>(null);

  const cookieLocale = useCookie<SupportedLocale>("site_locale", {
    sameSite: "lax",
    path: "/",
  });

  // SSR: read Accept-Language if available
  const headers = import.meta.server
    ? useRequestHeaders(["accept-language"])
    : {};
  const acceptLanguage = import.meta.server
    ? headers["accept-language"]
    : undefined;

  function detectFromAcceptLanguage(value?: string): SupportedLocale | null {
    // Very light parser: take first tag before comma
    const first = value?.split(",")?.[0]?.trim();
    return normalizeToSupported(first);
  }

  function detectFromNavigator(): SupportedLocale | null {
    if (!import.meta.client) return null;
    const tags = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    for (const t of tags) {
      const supported = normalizeToSupported(t);
      if (supported) return supported;
    }
    return null;
  }

  function detectZoneClient() {
    if (!import.meta.client) return;

    try {
      timeZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
    } catch {
      timeZone.value = null;
    }

    languageTag.value = navigator.language ?? null;

    // Best effort region from BCP47, e.g. "ca-ES" -> "ES"
    const parts = (navigator.language ?? "").split("-");
    region.value = parts[1]?.toUpperCase() ?? null;
  }

  function guessLocale(): SupportedLocale {
    // 1) User override
    if (cookieLocale.value) return cookieLocale.value;

    // 2) SSR: Accept-Language
    const fromHeader = detectFromAcceptLanguage(acceptLanguage);
    if (fromHeader) return fromHeader;

    // 3) Client: navigator.languages
    const fromNavigator = detectFromNavigator();
    if (fromNavigator) return fromNavigator;

    // 4) Client: timezone heuristic (very conservative)
    // If user is in Europe/Madrid, default to "ca" (your preference).
    if (import.meta.client && timeZone.value === "Europe/Madrid") return "ca";

    return DEFAULT_LOCALE;
  }

  function setLocale(locale: SupportedLocale) {
    cookieLocale.value = locale;
  }

  onMounted(() => {
    detectZoneClient();
  });

  return {
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE,
    cookieLocale,
    timeZone,
    languageTag,
    region,
    guessLocale,
    setLocale,
  };
}
