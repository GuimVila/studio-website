import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = body?.token;

  if (!token || typeof token !== "string") {
    return { ok: false };
  }

  const supabase = createClient(
    process.env.NUXT_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Busquem el registre pendent de confirmar
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, confirmation_expires_at")
    .eq("confirmation_token", token)
    .eq("is_confirmed", false)
    .single();

  if (error || !data) {
    console.error("[newsletter confirm] token invalid", error);
    return { ok: false };
  }

  // Token caducat
  if (
    data.confirmation_expires_at &&
    new Date(data.confirmation_expires_at) < new Date()
  ) {
    console.warn("[newsletter confirm] token expired");
    return { ok: false };
  }

  // Confirmem subscripció
  const { error: updateError } = await supabase
    .from("newsletter_subscribers")
    .update({
      is_confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmation_token: null,
      confirmation_expires_at: null,
    })
    .eq("confirmation_token", token);

  if (updateError) {
    console.error("[newsletter confirm] update failed", updateError);
    return { ok: false };
  }

  return { ok: true };
});
