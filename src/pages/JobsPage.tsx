import { PageHeader } from '@/components/layout/PageHeader'
import { JobsList } from '@/components/jobs/JobsList'

export function JobsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Marketplace"
        title="Jobs"
        description="Ongoing roles from verified hiring partners."
      />
      <JobsList type="job" />
    </div>
  )
}
