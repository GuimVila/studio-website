import { serverSupabaseClient } from "#supabase/server";

type Database = {
  public: {
    Tables: {
      newsletter_subscribers: {
        Row: {
          id: string; // uuid
          email: string;
          is_confirmed: boolean | null;
          language: string | null;
          source: string | null;
          created_at: string | null; // timestamptz
          confirmation_token: string; // uuid
          confirmed_at: string | null; // timestamptz
          unsubscribed_at: string | null; // timestamptz
          confirmation_expires_at: string | null; // timestamptz
        };
        Insert: {
          id?: string;
          email: string;
          is_confirmed?: boolean | null;
          language?: string | null;
          source?: string | null;
          created_at?: string | null;
          confirmation_token?: string; // default gen_random_uuid()
          confirmed_at?: string | null;
          unsubscribed_at?: string | null;
          confirmation_expires_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          is_confirmed?: boolean | null;
          language?: string | null;
          source?: string | null;
          created_at?: string | null;
          confirmation_token?: string;
          confirmed_at?: string | null;
          unsubscribed_at?: string | null;
          confirmation_expires_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token?.toString();
  if (!token || !uuidRegex.test(token)) {
    return sendRedirect(event, "/subscribe/error", 302);
  }

  // IMPORTANT: ara el client està tipat, i desapareix el `never`
  const supabase = await serverSupabaseClient<Database>(event);

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, confirmation_expires_at, is_confirmed")
    .eq("confirmation_token", token)
    .maybeSingle();

  if (error || !data) return sendRedirect(event, "/subscribe/error", 302);

  // is_confirmed és nullable a DB segons l'esquema
  if (data.is_confirmed === true) {
    return sendRedirect(event, "/subscribe/confirmed", 302);
  }

  if (
    data.confirmation_expires_at &&
    new Date(data.confirmation_expires_at).getTime() < Date.now()
  ) {
    return sendRedirect(event, "/subscribe/error", 302);
  }

  const { error: updateError } = await supabase
    .from("newsletter_subscribers")
    .update({
      is_confirmed: true,
      confirmed_at: new Date().toISOString(),
    })
    .eq("confirmation_token", token);

  if (updateError) {
    return sendRedirect(event, "/subscribe/error", 302);
  }

  return sendRedirect(event, "/subscribe/confirmed", 302);
});
