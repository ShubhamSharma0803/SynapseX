import { createClient } from '@supabase/supabase-js'

// Get environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ SUPABASE CONFIGURATION ERROR\n' +
    '================================\n' +
    'Missing required environment variables!\n\n' +
    'Required variables:\n' +
    '  - VITE_SUPABASE_URL\n' +
    '  - VITE_SUPABASE_ANON_KEY\n\n' +
    'Please check your .env file in the frontend directory.\n' +
    'Example:\n' +
    '  VITE_SUPABASE_URL=https://xxxxx.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n\n' +
    'After adding these variables, restart your dev server.'
  )
}

// Initialize and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
})

// Optional: Log successful initialization in development
if (import.meta.env.DEV && supabaseUrl && supabaseAnonKey) {
  console.log('✅ Supabase client initialized successfully')
}