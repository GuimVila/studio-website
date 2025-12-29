import { Resend } from "resend";
import { serverSupabaseClient } from "#supabase/server";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; honeypot?: string }>(event);

  // Honeypot
  if (body?.honeypot) return { ok: true };

  const email = (body?.email || "").trim().toLowerCase();
  if (!email)
    throw createError({ statusCode: 400, statusMessage: "Missing email" });

  const supabase = await serverSupabaseClient(event);

  // Token + expiració
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // Inserta o actualitza “pending”
  const { error } = await supabase.from("newsletter_subscribers").upsert(
    {
      email,
      confirm_token: token,
      confirmation_expires_at: expiresAt,
      is_confirmed: false,
    },
    { onConflict: "email" }
  );

  // UX silenciosa
  if (error) return { ok: true };

  const resend = new Resend(process.env.RESEND_API_KEY);
  const confirmLink = `${process.env.NUXT_SITE_URL}/subscribe/confirm?token=${token}`;

  await resend.emails.send({
    from: process.env.NEWSLETTER_FROM!,
    to: email,
    subject: "Confirma la teva subscripció",
    html: `
      <p>Confirma la teva subscripció fent clic aquí:</p>
      <p><a href="${confirmLink}">Confirmar subscripció</a></p>
      <p>Si no has estat tu, ignora aquest correu.</p>
    `,
  });

  return { ok: true };
});
