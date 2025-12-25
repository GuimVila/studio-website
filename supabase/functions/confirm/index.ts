import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";

  if (!token) {
    return Response.redirect(
      `${siteUrl}/subscribe/error`,
      302
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({
      is_confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmation_token: null,
    })
    .eq("confirmation_token", token)
    .eq("is_confirmed", false)
    .gt("confirmation_expires_at", new Date().toISOString())
    .select()
    .single();

  if (error || !data) {
    return Response.redirect(
      `${siteUrl}/subscribe/error`,
      302
    );
  }

  return Response.redirect(
    `${siteUrl}/subscribe/confirmed`,
    302
  );
});
