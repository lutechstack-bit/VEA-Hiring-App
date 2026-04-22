import { Clock, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  /** editor = prompt to complete profile; partner = prompt to post first job */
  role: 'editor' | 'partner'
}

export function PendingBanner({ role }: Props) {
  const { user } = useAuth()
  if (!user || user.status !== 'pending') return null

  const editorMsg = (
    <>
      <strong className="font-medium text-text-primary">Complete your profile</strong>
      <span className="text-text-secondary">
        {' '}— add your bio, skills, and portfolio links. Once you submit, our team
        reviews your profile and approves it so hiring partners can find you.
      </span>
    </>
  )

  const partnerMsg = (
    <>
      <strong className="font-medium text-text-primary">Set up your account</strong>
      <span className="text-text-secondary">
        {' '}— post your first job or gig. Our admin team reviews each posting
        before it goes live so only quality opportunities reach editors.
      </span>
    </>
  )

  const cta = role === 'editor'
    ? { to: '/profile', label: 'Complete profile' }
    : { to: '/postings/new', label: 'Post a job' }

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-status-warning/25 bg-status-warningBg/60 px-4 py-3.5">
      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-status-warning" />
      <div className="flex-1 text-sm leading-relaxed">
        {role === 'editor' ? editorMsg : partnerMsg}
      </div>
      <Link
        to={cta.to}
        className="flex shrink-0 items-center gap-1 rounded-lg bg-status-warning/10 px-3 py-1.5 text-xs font-medium text-status-warning hover:bg-status-warning/20 transition-colors"
      >
        {cta.label}
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
