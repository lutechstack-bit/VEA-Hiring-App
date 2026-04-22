import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const SUPABASE_CONFIGURED = Boolean(url) && Boolean(anon)

if (!SUPABASE_CONFIGURED) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Copy .env.example → .env.local and fill them in.',
  )
}

// createClient validates the URL at construction time and throws on an
// invalid host, so fall back to a well-formed placeholder. Any call against
// the client will still fail at runtime (which is fine — the UI shows a
// "not configured" banner).
export const supabase = createClient<Database>(
  url || 'https://placeholder.supabase.co',
  anon || 'placeholder-anon-key',
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: { eventsPerSecond: 5 },
  },
})

export const threadIdFor = (a: string, b: string) =>
  a < b ? `${a}:${b}` : `${b}:${a}`
