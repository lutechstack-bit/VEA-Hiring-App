import { createClient, type SupabaseClient } from '@supabase/supabase-js'
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

// In-memory sequential mutex — intentionally avoids navigator.locks.
//
// navigator.locks entries survive hard-refreshes and tab crashes, leaving
// zombie locks that block every subsequent auth call indefinitely. An
// in-memory queue resets on every page load so zombie locks are impossible.
// The only downside is no cross-tab coordination, which is an acceptable
// trade-off: the session auto-heals via the refresh-token on the next load.
let _lockQueue = Promise.resolve()
function reliableLock<T>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<T>,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    _lockQueue = _lockQueue.then(() => fn().then(resolve, reject))
  })
}

function makeClient() {
  return createClient<Database>(
    url || 'https://placeholder.supabase.co',
    anon || 'placeholder-anon-key',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'lu-auth',     // unique key avoids collisions with stale locks
        lock: reliableLock,
      },
      realtime: {
        params: { eventsPerSecond: 5 },
      },
    },
  )
}

// HMR-aware singleton — reuse the same client across Vite hot reloads so we
// never have two GoTrueClient instances competing in the same browser context.
type HotData = { client?: SupabaseClient<Database> }

let _supabase: SupabaseClient<Database>

if (import.meta.hot) {
  const hotData = import.meta.hot.data as HotData
  if (!hotData.client) {
    hotData.client = makeClient()
  }
  _supabase = hotData.client
} else {
  _supabase = makeClient()
}

export const supabase = _supabase

export const threadIdFor = (a: string, b: string) =>
  a < b ? `${a}:${b}` : `${b}:${a}`
