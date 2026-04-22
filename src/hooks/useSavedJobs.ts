import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { JobRow, SavedJobRow } from '@/lib/types'

export function useSavedJobs(editorId: string | undefined) {
  return useQuery({
    queryKey: ['saved-jobs', editorId],
    enabled: Boolean(editorId),
    queryFn: async (): Promise<(SavedJobRow & { job: JobRow })[]> => {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*, job:jobs(*)')
        .eq('editor_id', editorId as string)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as unknown as (SavedJobRow & { job: JobRow })[]
    },
  })
}

export function useSavedJobIds(editorId: string | undefined) {
  return useQuery({
    queryKey: ['saved-job-ids', editorId],
    enabled: Boolean(editorId),
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('editor_id', editorId as string)
      if (error) throw error
      return new Set((data ?? []).map((r) => r.job_id as string))
    },
  })
}

export function useToggleSavedJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      editorId,
      jobId,
      saved,
    }: {
      editorId: string
      jobId: string
      saved: boolean
    }) => {
      if (saved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('editor_id', editorId)
          .eq('job_id', jobId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('saved_jobs').insert({
          editor_id: editorId,
          job_id: jobId,
        })
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['saved-jobs'] })
      qc.invalidateQueries({ queryKey: ['saved-job-ids'] })
    },
  })
}
