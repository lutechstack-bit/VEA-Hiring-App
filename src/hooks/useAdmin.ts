import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type {
  ActivityRow,
  JobRow,
  ProfileRow,
  Tag,
  UserRow,
  UserStatus,
} from '@/lib/types'

export interface AdminMetrics {
  users: number
  editors: number
  partners: number
  pendingUsers: number
  activeJobs: number
  activeGigs: number
  applications: number
  hires: number
}

export function useAdminMetrics() {
  return useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async (): Promise<AdminMetrics> => {
      const [users, jobs, apps] = await Promise.all([
        supabase.from('users').select('role,status'),
        supabase.from('jobs').select('status,type'),
        supabase.from('applications').select('status'),
      ])
      if (users.error) throw users.error
      if (jobs.error) throw jobs.error
      if (apps.error) throw apps.error
      const u = users.data ?? []
      const j = jobs.data ?? []
      const a = apps.data ?? []
      return {
        users: u.length,
        editors: u.filter((x) => x.role === 'editor').length,
        partners: u.filter((x) => x.role === 'partner').length,
        pendingUsers: u.filter((x) => x.status === 'pending').length,
        activeJobs: j.filter((x) => x.status === 'approved' && x.type === 'job').length,
        activeGigs: j.filter((x) => x.status === 'approved' && x.type === 'gig').length,
        applications: a.length,
        hires: a.filter((x) => x.status === 'Hired').length,
      }
    },
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<(UserRow & { profile: ProfileRow | null })[]> => {
      const { data, error } = await supabase
        .from('users')
        .select('*, profile:profiles(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as unknown as (UserRow & { profile: ProfileRow | null })[]
    },
  })
}

export function useAdminJobs() {
  return useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async (): Promise<(JobRow & { poster: UserRow | null })[]> => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, poster:users!jobs_posted_by_fkey(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as unknown as (JobRow & { poster: UserRow | null })[]
    },
  })
}

export function useAdminActivity() {
  return useQuery({
    queryKey: ['admin-activity'],
    queryFn: async (): Promise<ActivityRow[]> => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)
      if (error) throw error
      return (data ?? []) as ActivityRow[]
    },
  })
}

export function useSetUserStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      const patch: Partial<UserRow> = { status }
      if (status === 'approved') patch.approved_at = new Date().toISOString()
      const { error } = await supabase.from('users').update(patch).eq('id', id)
      if (error) throw error
      const actor = (await supabase.auth.getUser()).data.user?.id ?? null
      await (supabase.rpc as unknown as (
        name: string,
        args: Record<string, unknown>,
      ) => Promise<unknown>)('log_activity', {
        _actor: actor,
        _action: `user_${status}`,
        _target_type: 'user',
        _target_id: id,
        _metadata: {},
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      qc.invalidateQueries({ queryKey: ['admin-metrics'] })
      qc.invalidateQueries({ queryKey: ['admin-activity'] })
    },
  })
}

export function useSetUserTags() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, tags }: { userId: string; tags: Tag[] }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ tags })
        .eq('user_id', userId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useAdminApproveJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: 'approved' | 'rejected'
    }) => {
      const patch: Partial<JobRow> = { status }
      if (status === 'approved') patch.approved_at = new Date().toISOString()
      const { error } = await supabase.from('jobs').update(patch).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-jobs'] })
      qc.invalidateQueries({ queryKey: ['jobs'] })
      qc.invalidateQueries({ queryKey: ['admin-metrics'] })
    },
  })
}
