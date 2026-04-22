import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastKind = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  kind: ToastKind
  title: string
  description?: string
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { ...t, id }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 4500)
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (title, description) => toast({ kind: 'success', title, description }),
      error: (title, description) => toast({ kind: 'error', title, description }),
      info: (title, description) => toast({ kind: 'info', title, description }),
    }),
    [toast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center gap-2 px-4 pt-4 sm:items-end sm:p-6">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon =
    toast.kind === 'success'
      ? CheckCircle2
      : toast.kind === 'error'
        ? XCircle
        : toast.kind === 'warning'
          ? AlertTriangle
          : Info
  const accent =
    toast.kind === 'success'
      ? 'text-status-success'
      : toast.kind === 'error'
        ? 'text-status-danger'
        : toast.kind === 'warning'
          ? 'text-status-warning'
          : 'text-brand-purpleLight'

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm rounded-xl border border-white/10 bg-background-tertiary/95 backdrop-blur',
        'p-4 shadow-glow-md animate-fade-in',
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', accent)} />
        <div className="flex-1">
          <p className="text-sm font-medium text-text-primary">{toast.title}</p>
          {toast.description ? (
            <p className="mt-0.5 text-xs text-text-secondary">{toast.description}</p>
          ) : null}
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
