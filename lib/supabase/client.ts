import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!url || !anonKey || url.includes('your-project-id')) {
    // Return null when placeholder or empty to trigger reliable mock-data mode
    return null
  }

  return createBrowserClient(url, anonKey)
}
