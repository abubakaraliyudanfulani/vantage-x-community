// VANTAGE X COMMUNITY — Supabase Configuration

const SUPABASE_URL = "https://urjxoewsgmfasnyygjuz.supabase.co";

// Replace this placeholder with your NEW Supabase publishable key.
// Never put your secret or service-role key in this file.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Cn4id_fYfIYkV5EUDKvWMA_yplZfC3A";

if (!window.supabase) {
  throw new Error("Supabase library failed to load.");
}

if (
  !SUPABASE_PUBLISHABLE_KEY ||
  SUPABASE_PUBLISHABLE_KEY === "sb_publishable_xR8TdlRI5ruMKQJ6TtEsMQ_054sQjoS"
) {
  throw new Error("Supabase publishable key has not been configured.");
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  }
);
