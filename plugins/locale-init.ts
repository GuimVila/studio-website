export default defineNuxtPlugin(async () => {
  const { setLocale, locale } = useI18n();

  // Llegeix la teva cookie (la mateixa que fas servir a useLocaleDetection)
  const cookieLocale = useCookie<"ca" | "es" | "en">("site_locale", {
    sameSite: "lax",
    path: "/",
  });

  const wanted = cookieLocale.value;

  // Si hi ha cookie i no coincideix, aplica-la a i18n
  if (wanted && wanted !== locale.value) {
    await setLocale(wanted);
  }
});
