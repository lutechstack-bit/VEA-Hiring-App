import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/shared/Avatar'
import type { ThreadSummary } from '@/hooks/useMessages'
import { cn, timeAgo } from '@/lib/utils'

export function ThreadList({
  threads,
  activeThreadId,
}: {
  threads: ThreadSummary[]
  activeThreadId?: string
}) {
  const navigate = useNavigate()

  if (!threads.length) {
    return (
      <div className="p-6 text-center text-sm text-text-muted">
        No conversations yet.
      </div>
    )
  }

  return (
    <ul className="divide-y divide-white/[0.06]">
      {threads.map((t) => {
        const active = t.thread_id === activeThreadId
        return (
          <li key={t.thread_id}>
            <button
              onClick={() => navigate(`/messages/${t.thread_id}`)}
              className={cn(
                'flex w-full items-start gap-3 p-4 text-left transition-colors',
                active
                  ? 'bg-brand-purple/10'
                  : 'hover:bg-white/[0.03]',
              )}
            >
              <Avatar name={t.other.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {t.other.name}
                  </p>
                  <span className="shrink-0 text-[11px] text-text-muted">
                    {timeAgo(t.last_message?.created_at ?? '')}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-text-secondary">
                  {t.last_message?.text ?? 'No messages yet'}
                </p>
                {t.unread_count > 0 ? (
                  <span className="mt-1 inline-flex items-center rounded-full bg-brand-purple/20 px-2 py-0.5 text-[10px] font-medium text-brand-purpleLight">
                    {t.unread_count} new
                  </span>
                ) : null}
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
