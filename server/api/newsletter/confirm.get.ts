import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token?.toString();
  if (!token) return sendRedirect(event, "/subscribe/error", 302);

  const supabase = await serverSupabaseClient(event);

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, confirmation_expires_at, is_confirmed")
    .eq("confirm_token", token)
    .maybeSingle();

  if (error || !data) return sendRedirect(event, "/subscribe/error", 302);

  if (data.is_confirmed)
    return sendRedirect(event, "/subscribe/confirmed", 302);

  if (
    data.confirmation_expires_at &&
    new Date(data.confirmation_expires_at).getTime() < Date.now()
  ) {
    return sendRedirect(event, "/subscribe/error", 302);
  }

  await supabase
    .from("newsletter_subscribers")
    .update({ is_confirmed: true, confirmed_at: new Date().toISOString() })
    .eq("confirm_token", token);

  return sendRedirect(event, "/subscribe/confirmed", 302);
});
