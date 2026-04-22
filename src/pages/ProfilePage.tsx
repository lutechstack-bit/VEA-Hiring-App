import { useAuth } from '@/hooks/useAuth'
import { EditorProfile } from '@/components/editor/EditorProfile'
import { PartnerProfile } from '@/components/partner/PartnerProfile'

export function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null
  if (user.role === 'editor') return <EditorProfile />
  return <PartnerProfile />
}
