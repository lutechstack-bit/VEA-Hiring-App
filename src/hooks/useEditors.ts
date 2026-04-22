import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ProfileRow, UserRow } from '@/lib/types'

export interface EditorListItem {
  user: Pick<UserRow, 'id' | 'name' | 'email'>
  profile: ProfileRow
}

interface Filters {
  search?: string
  tag?: string
  skill?: string
}

export function useEditors(filters: Filters = {}) {
  return useQuery({
    queryKey: ['editors', filters],
    queryFn: async (): Promise<EditorListItem[]> => {
      const { data, error } = await supabase
        .from('users')
        .select('id,name,email,role,status,profiles(*)')
        .eq('role', 'editor')
        .eq('status', 'approved')
      if (error) throw error
      type Row = { id: string; name: string; email: string; profiles: ProfileRow | ProfileRow[] | null }
      let rows = ((data ?? []) as unknown as Row[])
        .map<EditorListItem | null>((r) => {
          const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
          if (!profile) return null
          return {
            user: { id: r.id, name: r.name, email: r.email },
            profile,
          }
        })
        .filter(Boolean) as EditorListItem[]

      if (filters.tag) {
        rows = rows.filter((e) =>
          e.profile.tags.includes(filters.tag as ProfileRow['tags'][number]),
        )
      }
      if (filters.skill) {
        rows = rows.filter((e) =>
          e.profile.skills.map((s) => s.toLowerCase()).includes(filters.skill!.toLowerCase()),
        )
      }
      if (filters.search) {
        const s = filters.search.toLowerCase()
        rows = rows.filter(
          (e) =>
            e.user.name.toLowerCase().includes(s) ||
            (e.profile.bio ?? '').toLowerCase().includes(s),
        )
      }
      return rows
    },
  })
}

export function useEditor(userId: string | undefined) {
  return useQuery({
    queryKey: ['editor', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<EditorListItem | null> => {
      const { data, error } = await supabase
        .from('users')
        .select('id,name,email,role,status,profiles(*)')
        .eq('id', userId as string)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      type Row = { id: string; name: string; email: string; profiles: ProfileRow | ProfileRow[] | null }
      const row = data as unknown as Row
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
      if (!profile) return null
      return {
        user: { id: row.id, name: row.name, email: row.email },
        profile,
      }
    },
  })
}
