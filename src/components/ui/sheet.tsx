import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Sheet({
  open,
  onClose,
  side = 'right',
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  side?: 'right' | 'bottom'
  title?: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
      />
      <div
        className={cn(
          'absolute border border-white/[0.08] bg-background-secondary shadow-glow-md animate-fade-in',
          side === 'right'
            ? 'right-0 top-0 h-full w-full max-w-md overflow-y-auto'
            : 'bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl',
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-background-secondary/95 p-4 backdrop-blur">
          <h2 className="text-base font-medium text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted transition-colors hover:bg-white/[0.05] hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  )
}
