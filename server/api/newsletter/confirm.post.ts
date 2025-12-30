import { createClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          is_confirmed: boolean | null;
          language: string | null;
          source: string | null;
          created_at: string | null;
          confirmation_token: string;
          confirmed_at: string | null;
          unsubscribed_at: string | null;
          confirmation_expires_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          is_confirmed?: boolean | null;
          language?: string | null;
          source?: string | null;
          created_at?: string | null;
          confirmation_token?: string;
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

type ConfirmBody = { token?: unknown };

type ConfirmResponse =
  | { ok: true }
  | { ok: false; reason: "invalid" | "expired" | "config" | "error" };

export default defineEventHandler(async (event): Promise<ConfirmResponse> => {
  const body = await readBody<ConfirmBody>(event);
  const token = body?.token;

  if (typeof token !== "string" || !uuidRegex.test(token)) {
    return { ok: false, reason: "invalid" };
  }

  const supabaseUrl = process.env.NUXT_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[newsletter confirm] Missing Supabase env vars");
    return { ok: false, reason: "config" };
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // Busquem el registre pendent per token
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, confirmation_expires_at, is_confirmed")
    .eq("confirmation_token", token)
    .maybeSingle();

  if (error || !data) {
    console.error("[newsletter confirm] token invalid", error);
    return { ok: false, reason: "invalid" };
  }

  // Idempotent: si ja confirmat, ok
  if (data.is_confirmed === true) {
    return { ok: true };
  }

  // Expirat
  if (
    data.confirmation_expires_at &&
    new Date(data.confirmation_expires_at).getTime() < Date.now()
  ) {
    console.warn("[newsletter confirm] token expired");
    return { ok: false, reason: "expired" };
  }

  // Confirmem
  const { error: updateError } = await supabase
    .from("newsletter_subscribers")
    .update({
      is_confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmation_expires_at: null,
    })
    .eq("id", data.id);

  if (updateError) {
    console.error("[newsletter confirm] update failed", updateError);
    return { ok: false, reason: "error" };
  }

  return { ok: true };
});
