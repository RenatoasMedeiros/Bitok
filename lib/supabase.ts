import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseUrl = 'change this manually because expo kinda sucks can cant read a .env file';
const supabaseAnonKey = 'maybe i suck more idk.. :/';

// Check if running in the browser or Node.js
const isBrowser = typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isBrowser ? window.localStorage : undefined,
    detectSessionInUrl: isBrowser,
  },
});