import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.EXPO_SUPABASE_URL as string;
// const supabaseAnonKey = process.env.EXPO_SUPABASE_ANON_KEY as string;
const supabaseUrl = 'https://ubrntyhmzwnuxfxwrvsn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicm50eWhtendudXhmeHdydnNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MTU3NjIsImV4cCI6MjA0ODk5MTc2Mn0.Zz7XCM-jMXUXCFTd6yfu6Zevn218M-DOfYVraOOIh_I';

// Check if running in the browser or Node.js
const isBrowser = typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isBrowser ? window.localStorage : undefined,
    detectSessionInUrl: isBrowser,
  },
});