import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { render } from "@react-email/render";
import ConfirmSubscription from "~/emails/templates/ConfirmSubscription";

type Body = { email?: string; honeypot?: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function nowIso() {
  return new Date().toISOString();
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event);

  // Honeypot (bots)
  if (body?.honeypot) return { ok: true };

  const email = (body?.email || "").trim().toLowerCase();
  if (!email) return { ok: true }; // UX silenciosa

  const supabaseUrl = process.env.NUXT_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[newsletter resend] Missing Supabase env vars");
    return { ok: true };
  }

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;
  const confirmBase =
    process.env.NEWSLETTER_CONFIRM_URL ??
    (process.env.NUXT_SITE_URL
      ? `${process.env.NUXT_SITE_URL}/subscribe/confirmed`
      : "");
  const siteName = process.env.NUXT_SITE_NAME || "Guillem Vila";

  if (!resendKey || !from || !confirmBase) {
    console.error("[newsletter resend] Missing email env vars");
    return { ok: true };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select(
      "id, is_confirmed, confirmation_expires_at, confirmation_sent_count, confirmation_last_sent_at"
    )
    .eq("email", email)
    .maybeSingle();

  if (error || !data) {
    // no existeix → UX silenciosa
    return { ok: true };
  }

  if (data.is_confirmed === true) {
    // idempotent: ja confirmat
    return { ok: true };
  }

  // Rate limit (enterprise-grade, simple)
  const lastSent = data.confirmation_last_sent_at
    ? new Date(data.confirmation_last_sent_at).getTime()
    : 0;
  const minutesSinceLast =
    lastSent > 0 ? (Date.now() - lastSent) / 60000 : Infinity;

  // cooldown 2 minuts
  if (minutesSinceLast < 2) {
    return { ok: true };
  }

  // límit 3 intents cada 24h (si lastSent és dins 24h i count >= 3)
  const hoursSinceLast =
    lastSent > 0 ? (Date.now() - lastSent) / 3600000 : Infinity;
  const count = data.confirmation_sent_count ?? 0;

  if (hoursSinceLast < 24 && count >= 3) {
    return { ok: true };
  }

  // Token nou + expiració nova
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const newCount = hoursSinceLast >= 24 ? 1 : count + 1;

  const { error: upErr } = await supabase
    .from("newsletter_subscribers")
    .update({
      confirmation_token: token,
      confirmation_expires_at: expiresAt,
      confirmation_sent_count: newCount,
      confirmation_last_sent_at: nowIso(),
    })
    .eq("id", data.id);

  if (upErr) {
    console.error("[newsletter resend] supabase update error:", upErr);
    return { ok: true };
  }

  const confirmLink = `${confirmBase}?token=${token}`;

  const html = await render(
    ConfirmSubscription({
      confirmUrl: confirmLink,
      siteName,
      title: "Reenviament de confirmació",
      previewText: "Aquí tens l’enllaç per confirmar la subscripció",
      introText:
        "Sembla que encara no has confirmat la subscripció. Fes clic per confirmar-la ara.",
      buttonText: "Confirmar ara",
    })
  );

  const resend = new Resend(resendKey);
  const result = await resend.emails.send({
    from,
    to: email,
    subject: "Reenviament: confirma la teva subscripció",
    html,
  });

  if (isRecord(result) && "error" in result && result.error) {
    console.error("[newsletter resend] resend error:", result.error);
    return { ok: true };
  }

  return { ok: true };
});
