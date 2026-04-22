import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type {
  ApplicationRow,
  ApplicationStatus,
  ApplicationWithJob,
  JobRow,
  ProfileRow,
  UserRow,
} from '@/lib/types'

export function useMyApplications(editorId: string | undefined) {
  return useQuery({
    queryKey: ['my-applications', editorId],
    enabled: Boolean(editorId),
    queryFn: async (): Promise<ApplicationWithJob[]> => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, job:jobs(*)')
        .eq('editor_id', editorId as string)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as unknown as ApplicationWithJob[]
    },
  })
}

export interface PartnerApplicantRow extends ApplicationRow {
  job: JobRow
  editor: Pick<UserRow, 'id' | 'name' | 'email'>
  profile: ProfileRow | null
}

export function useApplicants(partnerId: string | undefined) {
  return useQuery({
    queryKey: ['applicants', partnerId],
    enabled: Boolean(partnerId),
    queryFn: async (): Promise<PartnerApplicantRow[]> => {
      const { data: jobs, error: jErr } = await supabase
        .from('jobs')
        .select('id')
        .eq('posted_by', partnerId as string)
      if (jErr) throw jErr
      const ids = (jobs ?? []).map((j) => j.id as string)
      if (ids.length === 0) return []

      const { data, error } = await supabase
        .from('applications')
        .select('*, job:jobs(*), editor:users(id,name,email), profile:profiles(*)')
        .in('job_id', ids)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as unknown as PartnerApplicantRow[]
    },
  })
}

export function useApplyToJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, editorId }: { jobId: string; editorId: string }) => {
      const { error } = await supabase.from('applications').insert({
        job_id: jobId,
        editor_id: editorId,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-applications'] })
      qc.invalidateQueries({ queryKey: ['applicants'] })
    },
  })
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
    }: {
      id: string
      status: ApplicationStatus
      note?: string
    }) => {
      const { error } = await supabase
        .from('applications')
        .update({ status, ...(note !== undefined ? { note } : {}) })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applicants'] })
      qc.invalidateQueries({ queryKey: ['my-applications'] })
    },
  })
}

export function useHasApplied(jobId: string, editorId: string | undefined) {
  return useQuery({
    queryKey: ['has-applied', jobId, editorId],
    enabled: Boolean(editorId),
    queryFn: async (): Promise<ApplicationRow | null> => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId)
        .eq('editor_id', editorId as string)
        .maybeSingle()
      if (error) throw error
      return (data as ApplicationRow | null) ?? null
    },
  })
}
