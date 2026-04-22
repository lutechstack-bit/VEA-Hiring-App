import type { MessageRow } from '@/lib/types'
import { cn } from '@/lib/utils'

export function MessageBubble({
  message,
  mine,
}: {
  message: MessageRow
  mine: boolean
}) {
  return (
    <div className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm sm:max-w-[65%]',
          mine
            ? 'rounded-br-md bg-gradient-to-br from-brand-purple to-brand-purpleDeep text-white'
            : 'rounded-bl-md border border-white/[0.06] bg-background-tertiary text-text-primary',
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        <p
          className={cn(
            'mt-1 text-right text-[10px]',
            mine ? 'text-white/70' : 'text-text-muted',
          )}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}
