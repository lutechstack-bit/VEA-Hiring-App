import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ProfileRow } from '@/lib/types'

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<ProfileRow | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId as string)
        .maybeSingle()
      if (error) throw error
      return (data as ProfileRow | null) ?? null
    },
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      userId,
      patch,
    }: {
      userId: string
      patch: Partial<ProfileRow>
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update(patch)
        .eq('user_id', userId)
      if (error) throw error
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ['profile', vars.userId] })
    },
  })
}
