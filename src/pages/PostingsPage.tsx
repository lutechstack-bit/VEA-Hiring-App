import { Routes, Route } from 'react-router-dom'
import { MyPostings } from '@/components/partner/MyPostings'
import { NewJobForm } from '@/components/partner/NewJobForm'

export function PostingsPage() {
  return (
    <Routes>
      <Route index element={<MyPostings />} />
      <Route path="new" element={<NewJobForm />} />
    </Routes>
  )
}
