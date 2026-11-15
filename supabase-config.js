
// VANTAGE X COMMUNITY — Supabase Configuration

const SUPABASE_URL = "https://urjxoewsgmfasnyygjuz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xR8TdlRI5ruMKQJ6TtEsMQ_054sQjoS";

if (!window.supabase) {
  throw new Error("Supabase library failed to load.");
}

if (!SUPABASE_PUBLISHABLE_KEY) {
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
