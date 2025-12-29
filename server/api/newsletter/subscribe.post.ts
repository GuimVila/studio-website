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
  const confirmLink = `${process.env.NUXT_SITE_URL}/subscribe/confirmed?token=${token}`;

  if (!process.env.NEWSLETTER_FROM) {
    throw createError({
      statusCode: 500,
      statusMessage: "NEWSLETTER_FROM environment variable is not set",
    });
  }

  const { data, error: resendError } = await resend.emails.send({
    from: process.env.NEWSLETTER_FROM as string,
    to: email,
    subject: "Confirma la teva subscripció",
    html: `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; line-height:1.5;">
      <h2>Confirma la teva subscripció</h2>
      <p>Fes clic al botó per confirmar:</p>
      <p>
        <a href="${confirmLink}" style="display:inline-block;padding:12px 16px;border-radius:10px;background:#ff6b35;color:#fff;text-decoration:none;font-weight:600;">
          Confirmar subscripció
        </a>
      </p>
      <p style="color:#666;font-size:14px;">Si no has estat tu, ignora aquest correu.</p>
    </div>
  `,
  });

  if (resendError) {
    console.error("[resend send error]", resendError);
    throw createError({
      statusCode: 500,
      statusMessage: "Resend failed to send email",
    });
  }

  console.log("[resend send ok]", data);
});
