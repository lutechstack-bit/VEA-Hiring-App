import { useState } from 'react'
import { ExternalLink, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { EditorListItem } from '@/hooks/useEditors'
import type { Tag } from '@/lib/types'
import { useSendMessage } from '@/hooks/useMessages'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { threadIdFor } from '@/lib/supabase'
import { Sheet } from '@/components/ui/sheet'
import { Avatar } from '@/components/shared/Avatar'
import { TagPill } from '@/components/shared/TagPill'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'
import { GradientButton } from '@/components/shared/GradientButton'
import { Textarea } from '@/components/ui/textarea'

export function EditorDetailDrawer({
  open,
  onClose,
  editor,
}: {
  open: boolean
  onClose: () => void
  editor: EditorListItem | null
}) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const send = useSendMessage()
  const toast = useToast()
  const navigate = useNavigate()

  if (!editor) return null

  const submit = async () => {
    if (!user || !message.trim()) return
    try {
      await send.mutateAsync({
        fromUserId: user.id,
        toUserId: editor.user.id,
        text: message.trim(),
      })
      toast.success('Message sent')
      setMessage('')
      navigate(`/messages/${threadIdFor(user.id, editor.user.id)}`)
    } catch (err) {
      toast.error('Could not send', err instanceof Error ? err.message : undefined)
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title={editor.user.name}>
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar name={editor.user.name} size="xl" />
          <div>
            <p className="text-lg font-medium">{editor.user.name}</p>
            <p className="text-xs text-text-secondary">
              {editor.profile.experience ?? '—'} · {editor.profile.location ?? '—'}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {editor.profile.tags.map((t) => (
                <TagPill key={t} tag={t as Tag} />
              ))}
            </div>
          </div>
        </div>

        {editor.profile.bio ? (
          <section>
            <EyebrowLabel>About</EyebrowLabel>
            <p className="mt-1.5 whitespace-pre-wrap text-sm text-text-secondary">
              {editor.profile.bio}
            </p>
          </section>
        ) : null}

        <section>
          <EyebrowLabel>Skills</EyebrowLabel>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {editor.profile.skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[11px] text-text-secondary"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {editor.profile.qualifications.length > 0 ? (
          <section>
            <EyebrowLabel>What they bring</EyebrowLabel>
            <ul className="mt-1.5 space-y-1 text-sm text-text-secondary">
              {editor.profile.qualifications.map((q) => (
                <li key={q}>· {q}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {editor.profile.portfolio_links.length > 0 ? (
          <section>
            <EyebrowLabel>Portfolio</EyebrowLabel>
            <ul className="mt-1.5 space-y-1.5">
              {editor.profile.portfolio_links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-brand-purpleLight hover:underline"
                  >
                    {l.label} <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <EyebrowLabel>Send a note</EyebrowLabel>
          <Textarea
            rows={4}
            className="mt-2"
            placeholder={`Hi ${editor.user.name.split(' ')[0]}, we'd love to chat about a role…`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <GradientButton
              onClick={submit}
              disabled={!message.trim()}
              loading={send.isPending}
            >
              <Send className="h-4 w-4" /> Send message
            </GradientButton>
          </div>
        </section>
      </div>
    </Sheet>
  )
}
