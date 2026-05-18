import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if we have a valid-looking URL
const isConfigured = supabaseUrl && supabaseUrl.startsWith('http');

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: { message: 'Supabase non configuré. Veuillez vérifier votre fichier .env.local' } }),
        signOut: async () => ({ error: null }),
      }
    };

if (!isConfigured) {
  console.warn('Supabase URL is missing or invalid. Authentication will be disabled.');
}
