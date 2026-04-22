import { QUICK_REPLIES } from '@/lib/constants'

export function QuickReplies({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {QUICK_REPLIES.map((q) => (
        <button
          key={q}
          onClick={() => onPick(q)}
          className="whitespace-nowrap rounded-full border border-brand-purple/20 bg-brand-purple/10 px-3 py-1.5 text-xs text-brand-purpleLight transition-colors hover:bg-brand-purple/20"
        >
          {q}
        </button>
      ))}
    </div>
  )
}
