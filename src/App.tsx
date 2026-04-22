import { AlertTriangle } from 'lucide-react'
import { AppRoutes } from '@/routes/AppRoutes'
import { SUPABASE_CONFIGURED } from '@/lib/supabase'

export default function App() {
  return (
    <>
      {!SUPABASE_CONFIGURED ? <EnvBanner /> : null}
      <AppRoutes />
    </>
  )
}

function EnvBanner() {
  return (
    <div className="fixed bottom-4 left-1/2 z-[200] w-[min(92vw,560px)] -translate-x-1/2 rounded-xl border border-status-warning/30 bg-status-warningBg/90 px-4 py-3 text-xs text-status-warning shadow-glow-md backdrop-blur">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="text-text-primary">
          <p className="font-medium">Supabase not configured</p>
          <p className="mt-0.5 text-text-secondary">
            Add <code className="rounded bg-background-tertiary px-1 py-0.5 text-[11px] text-text-primary">VITE_SUPABASE_URL</code>{' '}
            and <code className="rounded bg-background-tertiary px-1 py-0.5 text-[11px] text-text-primary">VITE_SUPABASE_ANON_KEY</code>{' '}
            to <code className="rounded bg-background-tertiary px-1 py-0.5 text-[11px] text-text-primary">.env.local</code> and restart the dev server. See{' '}
            <a
              href="https://github.com/lutechstack-bit/VEA-Hiring-App/blob/main/DEPLOY.md"
              className="underline underline-offset-4 hover:text-brand-purpleLight"
              target="_blank"
              rel="noopener noreferrer"
            >
              DEPLOY.md
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
