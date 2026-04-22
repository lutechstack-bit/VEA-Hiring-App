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

// Custom lock that falls back to a simple queued mutex when navigator.locks
// is unavailable or when a stale lock is detected (e.g. after HMR reloads or
// a hard-refresh mid-auth-operation). This prevents indefinite hangs.
let _lockQueue = Promise.resolve()
async function reliableLock<T>(
  _name: string,
  acquireTimeout: number,
  fn: () => Promise<T>,
): Promise<T> {
  // If navigator.locks is available and working, use it with a timeout guard
  if (typeof navigator !== 'undefined' && navigator.locks) {
    const result = await Promise.race([
      new Promise<T>((resolve, reject) => {
        navigator.locks
          .request(_name, { mode: 'exclusive' }, async () => {
            try {
              resolve(await fn())
            } catch (e) {
              reject(e)
            }
          })
          .catch(reject)
      }),
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Lock "${_name}" timed out after ${acquireTimeout}ms`)),
          acquireTimeout > 0 ? acquireTimeout : 5000,
        ),
      ),
    ])
    return result
  }

  // Fallback: simple promise queue (no true mutex, but prevents double-run)
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
