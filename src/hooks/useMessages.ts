import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase, threadIdFor } from '@/lib/supabase'
import type { MessageRow, UserRow } from '@/lib/types'

export interface ThreadSummary {
  thread_id: string
  other: Pick<UserRow, 'id' | 'name' | 'email' | 'role'>
  last_message: MessageRow | null
  unread_count: number
}

export function useThreads(userId: string | undefined) {
  return useQuery({
    queryKey: ['threads', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<ThreadSummary[]> => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
        .order('created_at', { ascending: false })
      if (error) throw error
      const rows = (data ?? []) as MessageRow[]

      // Group by thread_id, keep the most recent message per thread.
      const byThread = new Map<string, MessageRow[]>()
      for (const m of rows) {
        const list = byThread.get(m.thread_id) ?? []
        list.push(m)
        byThread.set(m.thread_id, list)
      }

      const otherIds = new Set<string>()
      byThread.forEach((msgs) => {
        msgs.forEach((m) => {
          otherIds.add(m.from_user_id === userId ? m.to_user_id : m.from_user_id)
        })
      })

      let others: UserRow[] = []
      if (otherIds.size) {
        const { data: u, error: uErr } = await supabase
          .from('users')
          .select('id,name,email,role,status,created_at,approved_at,approved_by')
          .in('id', Array.from(otherIds))
        if (uErr) throw uErr
        others = (u ?? []) as UserRow[]
      }

      const result: ThreadSummary[] = []
      byThread.forEach((msgs, thread_id) => {
        const first = msgs[0]
        if (!first) return
        const otherId =
          first.from_user_id === userId ? first.to_user_id : first.from_user_id
        const other = others.find((o) => o.id === otherId)
        if (!other) return
        const unread = msgs.filter(
          (m) => m.to_user_id === userId && m.read_at === null,
        ).length
        result.push({
          thread_id,
          other: { id: other.id, name: other.name, email: other.email, role: other.role },
          last_message: first,
          unread_count: unread,
        })
      })
      result.sort(
        (a, b) =>
          new Date(b.last_message?.created_at ?? 0).getTime() -
          new Date(a.last_message?.created_at ?? 0).getTime(),
      )
      return result
    },
  })
}

export function useThreadMessages(threadId: string | undefined) {
  const qc = useQueryClient()

  const q = useQuery({
    queryKey: ['thread', threadId],
    enabled: Boolean(threadId),
    queryFn: async (): Promise<MessageRow[]> => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId as string)
        .order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []) as MessageRow[]
    },
  })

  useEffect(() => {
    if (!threadId) return
    const channel = supabase
      .channel(`thread:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const m = payload.new as MessageRow
          qc.setQueryData<MessageRow[]>(['thread', threadId], (prev) =>
            prev ? [...prev, m] : [m],
          )
          qc.invalidateQueries({ queryKey: ['threads'] })
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [threadId, qc])

  return q
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      fromUserId,
      toUserId,
      text,
    }: {
      fromUserId: string
      toUserId: string
      text: string
    }) => {
      const thread_id = threadIdFor(fromUserId, toUserId)
      const { error } = await supabase.from('messages').insert({
        thread_id,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        text,
      })
      if (error) throw error
      return thread_id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}

export function useMarkThreadRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ threadId, userId }: { threadId: string; userId: string }) => {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('thread_id', threadId)
        .eq('to_user_id', userId)
        .is('read_at', null)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}
