import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { render } from "@react-email/render";
import ConfirmSubscription from "~/emails/templates/ConfirmSubscription";

type SubscribeBody = { email?: string; honeypot?: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SubscribeBody>(event);

  // Honeypot (bots)
  if (body?.honeypot) return { ok: true };

  const email = (body?.email || "").trim().toLowerCase();
  if (!email) {
    throw createError({ statusCode: 400, statusMessage: "Missing email" });
  }

  const supabaseUrl = process.env.NUXT_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[newsletter subscribe] Missing Supabase env vars");
    // UX silenciosa, però en realitat això és config trencada
    return { ok: true };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // Token + expiració
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // Upsert pending (per email)
  const { error: dbError } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      {
        email,
        confirmation_token: token,
        confirmation_expires_at: expiresAt,
        is_confirmed: false,
        confirmed_at: null,
        unsubscribed_at: null,
      },
      { onConflict: "email" }
    );

  if (dbError) {
    console.error("[newsletter subscribe] supabase upsert error:", dbError);
    return { ok: true };
  }

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;

  // Preferim NEWSLETTER_CONFIRM_URL si existeix; si no, fem fallback a NUXT_SITE_URL
  const confirmBase =
    process.env.NEWSLETTER_CONFIRM_URL ??
    (process.env.NUXT_SITE_URL
      ? `${process.env.NUXT_SITE_URL}/subscribe/confirmed`
      : "");

  if (!resendKey) {
    console.error("[newsletter subscribe] Missing RESEND_API_KEY env var");
    throw createError({
      statusCode: 500,
      statusMessage: "Email not configured",
    });
  }
  if (!from) {
    console.error("[newsletter subscribe] Missing NEWSLETTER_FROM env var");
    throw createError({
      statusCode: 500,
      statusMessage: "Email not configured",
    });
  }
  if (!confirmBase) {
    console.error(
      "[newsletter subscribe] Missing NEWSLETTER_CONFIRM_URL and NUXT_SITE_URL env vars"
    );
    throw createError({
      statusCode: 500,
      statusMessage: "Site URL not configured",
    });
  }

  const confirmLink = `${confirmBase}?token=${token}`;

  const siteName = process.env.NUXT_SITE_NAME || "Guillem Vila";

  const html = await render(
    ConfirmSubscription({
      confirmUrl: confirmLink,
      siteName,
    })
  );

  const resend = new Resend(resendKey);
  const result = await resend.emails.send({
    from,
    to: email,
    subject: "Confirma la teva subscripció",
    html,
  });

  // Resend acostuma a retornar { data, error }
  if (isRecord(result) && "error" in result && result.error) {
    console.error("[newsletter subscribe] resend error:", result.error);
    throw createError({ statusCode: 500, statusMessage: "Email send failed" });
  }

  return { ok: true };
});
