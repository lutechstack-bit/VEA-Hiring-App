import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { JobRow, JobType } from '@/lib/types'

interface UseJobsFilter {
  type?: JobType
  search?: string
  skill?: string
  experience?: string
  workMode?: string
  employmentType?: string
}

export function useJobs(filter: UseJobsFilter = {}) {
  return useQuery({
    queryKey: ['jobs', filter],
    queryFn: async (): Promise<JobRow[]> => {
      let q = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (filter.type) q = q.eq('type', filter.type)
      if (filter.experience) q = q.eq('experience', filter.experience)
      if (filter.workMode) q = q.eq('work_mode', filter.workMode)
      if (filter.employmentType) q = q.eq('employment_type', filter.employmentType)
      if (filter.skill) q = q.contains('skills', [filter.skill])

      const { data, error } = await q
      if (error) throw error
      let rows = (data ?? []) as JobRow[]
      if (filter.search) {
        const s = filter.search.toLowerCase()
        rows = rows.filter(
          (j) =>
            j.title.toLowerCase().includes(s) ||
            j.company.toLowerCase().includes(s) ||
            j.description.toLowerCase().includes(s),
        )
      }
      return rows
    },
  })
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: ['job', id],
    enabled: Boolean(id),
    queryFn: async (): Promise<JobRow | null> => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id as string)
        .maybeSingle()
      if (error) throw error
      return (data as JobRow | null) ?? null
    },
  })
}

export function useMyPostings(userId: string | undefined) {
  return useQuery({
    queryKey: ['my-postings', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<JobRow[]> => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('posted_by', userId as string)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as JobRow[]
    },
  })
}

export function useCreateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<JobRow, 'id' | 'created_at' | 'approved_at' | 'status'>) => {
      const { error, data } = await supabase
        .from('jobs')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data as JobRow
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-postings'] })
      qc.invalidateQueries({ queryKey: ['jobs'] })
      qc.invalidateQueries({ queryKey: ['admin-jobs'] })
    },
  })
}

export function useUpdateJobStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: JobRow['status'] }) => {
      const patch: Partial<JobRow> = { status }
      if (status === 'approved') patch.approved_at = new Date().toISOString()
      const { error } = await supabase.from('jobs').update(patch).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      qc.invalidateQueries({ queryKey: ['admin-jobs'] })
      qc.invalidateQueries({ queryKey: ['my-postings'] })
    },
  })
}

export function useDeleteJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('jobs').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      qc.invalidateQueries({ queryKey: ['admin-jobs'] })
      qc.invalidateQueries({ queryKey: ['my-postings'] })
    },
  })
}
