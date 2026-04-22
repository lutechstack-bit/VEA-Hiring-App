import { useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useThreads } from '@/hooks/useMessages'
import { ThreadList } from './ThreadList'
import { ThreadView } from './ThreadView'
import { ListSkeleton } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MessagesLayout() {
  const { user } = useAuth()
  const { threadId } = useParams<{ threadId: string }>()
  const { data: threads, isLoading } = useThreads(user?.id)

  const activeSummary =
    (threads ?? []).find((t) => t.thread_id === threadId) ?? null

  return (
    <div className="-mx-4 sm:-mx-6">
      <div className="grid min-h-[calc(100vh-8rem)] grid-cols-1 border-y border-white/[0.06] md:grid-cols-[320px_1fr]">
        <aside
          className={cn(
            'border-r border-white/[0.06] bg-background-secondary',
            threadId ? 'hidden md:block' : 'block',
          )}
        >
          <header className="border-b border-white/[0.06] p-4">
            <p className="text-sm font-medium">Messages</p>
            <p className="text-[11px] text-text-muted">Real-time, verified only</p>
          </header>
          {isLoading ? (
            <div className="p-4">
              <ListSkeleton rows={3} />
            </div>
          ) : (
            <ThreadList threads={threads ?? []} activeThreadId={threadId} />
          )}
        </aside>

        <section
          className={cn(
            'bg-background-primary',
            !threadId ? 'hidden md:block' : 'block',
          )}
        >
          {threadId ? (
            <ThreadView threadId={threadId} summary={activeSummary} />
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Pick a thread on the left to start reading and replying."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
