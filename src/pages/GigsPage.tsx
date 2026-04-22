import { PageHeader } from '@/components/layout/PageHeader'
import { JobsList } from '@/components/jobs/JobsList'

export function GigsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Marketplace"
        title="Gigs"
        description="One-off projects and short contracts. Flexible by design."
      />
      <JobsList type="gig" />
    </div>
  )
}
