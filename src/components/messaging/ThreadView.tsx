import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  useMarkThreadRead,
  useSendMessage,
  useThreadMessages,
} from '@/hooks/useMessages'
import { useToast } from '@/hooks/useToast'
import type { ThreadSummary } from '@/hooks/useMessages'
import { MessageBubble } from './MessageBubble'
import { QuickReplies } from './QuickReplies'
import { Avatar } from '@/components/shared/Avatar'
import { Textarea } from '@/components/ui/textarea'
import { GradientButton } from '@/components/shared/GradientButton'

export function ThreadView({
  threadId,
  summary,
}: {
  threadId: string
  summary: ThreadSummary | null
}) {
  const { user } = useAuth()
  const { data: messages, isLoading } = useThreadMessages(threadId)
  const send = useSendMessage()
  const markRead = useMarkThreadRead()
  const toast = useToast()
  const navigate = useNavigate()

  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (user && threadId) {
      markRead.mutate({ threadId, userId: user.id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, threadId])

  const onSend = async () => {
    if (!user || !summary || !text.trim()) return
    try {
      await send.mutateAsync({
        fromUserId: user.id,
        toUserId: summary.other.id,
        text: text.trim(),
      })
      setText('')
    } catch (err) {
      toast.error('Could not send', err instanceof Error ? err.message : undefined)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-white/[0.06] p-4">
        <button
          className="rounded-md p-1 text-text-muted transition-colors hover:bg-white/[0.05] md:hidden"
          onClick={() => navigate('/messages')}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar name={summary?.other.name ?? '?'} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {summary?.other.name ?? 'Conversation'}
          </p>
          <p className="text-[11px] capitalize text-text-muted">
            {summary?.other.role ?? ''}
          </p>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto bg-background-primary/20 p-4"
      >
        {isLoading ? (
          <p className="text-xs text-text-muted">Loading conversation…</p>
        ) : (
          (messages ?? []).map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              mine={m.from_user_id === user?.id}
            />
          ))
        )}
      </div>

      <div className="border-t border-white/[0.06] p-4">
        <QuickReplies onPick={(t) => setText((prev) => (prev ? `${prev} ${t}` : t))} />
        <div className="flex items-end gap-2">
          <Textarea
            rows={1}
            className="min-h-[44px] resize-none"
            placeholder="Write a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
          />
          <GradientButton
            onClick={onSend}
            disabled={!text.trim()}
            loading={send.isPending}
            size="md"
          >
            <Send className="h-4 w-4" /> Send
          </GradientButton>
        </div>
      </div>
    </div>
  )
}
