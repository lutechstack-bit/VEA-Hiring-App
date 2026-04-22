import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useCreateJob } from '@/hooks/useJobs'
import { useToast } from '@/hooks/useToast'
import { EXPERIENCE_LEVELS, QUALIFICATIONS_LIST, WORK_MODES } from '@/lib/constants'
import type { EmploymentType, Experience, JobType, WorkMode } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { GradientButton } from '@/components/shared/GradientButton'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'
import { PageHeader } from '@/components/layout/PageHeader'
import { SkillsSelector } from '@/components/editor/SkillsSelector'
import { JobTypeSelector } from '@/components/jobs/JobTypeSelector'
import { cn } from '@/lib/utils'
import { Check, ChevronDown } from 'lucide-react'

const schema = z.object({
  title: z.string().min(3, 'A clearer title helps editors decide.'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  budget: z.string().min(1, 'Budget is required'),
  description: z.string().min(30, 'Describe the role in a few sentences.'),
})
type Values = z.infer<typeof schema>

export function NewJobForm() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const createJob = useCreateJob()

  const [type, setType] = useState<JobType>('job')
  const [workMode, setWorkMode] = useState<WorkMode>('Remote')
  const [experience, setExperience] = useState<Experience>('Intermediate')
  const [employment, setEmployment] = useState<EmploymentType | null>('Full-time')
  const [empOpen, setEmpOpen] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [quals, setQuals] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const submit = handleSubmit(async (v) => {
    if (!user) return
    try {
      await createJob.mutateAsync({
        posted_by: user.id,
        type,
        employment_type: employment,
        title: v.title,
        company: v.company,
        location: v.location,
        work_mode: workMode,
        budget: v.budget,
        budget_type: type === 'job' ? 'salary' : 'project',
        description: v.description,
        skills,
        qualifications: quals,
        experience,
      })
      toast.success(
        'Posted for review',
        'An admin will approve it shortly. Editors will see it after approval.',
      )
      navigate('/postings')
    } catch (err) {
      toast.error('Could not post', err instanceof Error ? err.message : undefined)
    }
  })

  return (
    <div>
      <PageHeader
        eyebrow="Hire"
        title="Post a new role"
        description="Fill this out in a few minutes. Approved postings appear in the editor marketplace within hours."
      />

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
            <EyebrowLabel>Basics</EyebrowLabel>
            <div className="mt-4 space-y-4">
              <div>
                <Label className="mb-2 block">Job or gig?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['job', 'gig'] as JobType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={cn(
                        'rounded-lg border px-4 py-3 text-left text-sm transition-all',
                        type === t
                          ? 'border-brand-purple/60 bg-brand-purple/10 text-brand-purpleLight'
                          : 'border-white/[0.08] bg-background-tertiary text-text-secondary hover:border-brand-purple/30',
                      )}
                    >
                      <p className="font-medium capitalize">{t}</p>
                      <p className="text-[11px] text-text-muted">
                        {t === 'job' ? 'Ongoing role, monthly pay' : 'One-off project'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Lead video editor" {...register('title')} />
                  {errors.title ? (
                    <p className="mt-1 text-xs text-status-danger">{errors.title.message}</p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Lumio Studios"
                    defaultValue={user?.name}
                    {...register('company')}
                  />
                  {errors.company ? (
                    <p className="mt-1 text-xs text-status-danger">{errors.company.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="loc">Location</Label>
                  <Input id="loc" placeholder="Mumbai, MH" {...register('location')} />
                  {errors.location ? (
                    <p className="mt-1 text-xs text-status-danger">{errors.location.message}</p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="budget">
                    {type === 'job' ? 'Monthly budget' : 'Project budget'}
                  </Label>
                  <Input
                    id="budget"
                    placeholder={type === 'job' ? '₹80,000 / month' : '₹25,000 / project'}
                    {...register('budget')}
                  />
                  {errors.budget ? (
                    <p className="mt-1 text-xs text-status-danger">{errors.budget.message}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
            <EyebrowLabel>Expectations</EyebrowLabel>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <Label>Work mode</Label>
                <Select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                >
                  {WORK_MODES.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Experience</Label>
                <Select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value as Experience)}
                >
                  {EXPERIENCE_LEVELS.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="hidden sm:block">
                <Label>Employment type</Label>
                <button
                  type="button"
                  onClick={() => setEmpOpen(true)}
                  className="w-full rounded-lg border border-white/[0.08] bg-background-tertiary px-4 py-2.5 text-left text-sm"
                >
                  <span className="flex items-center justify-between">
                    {employment ?? 'Pick one'}
                    <ChevronDown className="h-4 w-4 text-text-muted" />
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-3 sm:hidden">
              <Label>Employment type</Label>
              <button
                type="button"
                onClick={() => setEmpOpen(true)}
                className="w-full rounded-lg border border-white/[0.08] bg-background-tertiary px-4 py-3 text-left text-sm"
              >
                <span className="flex items-center justify-between">
                  {employment ?? 'Pick one'}
                  <ChevronDown className="h-4 w-4 text-text-muted" />
                </span>
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
            <EyebrowLabel>Skills & fit</EyebrowLabel>
            <div className="mt-4 space-y-5">
              <div>
                <Label>Required skills</Label>
                <div className="mt-1">
                  <SkillsSelector value={skills} onChange={setSkills} />
                </div>
              </div>
              <div>
                <Label>Qualifications</Label>
                <p className="mb-2 text-xs text-text-muted">
                  What matters most for this role?
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUALIFICATIONS_LIST.map((q) => {
                    const active = quals.includes(q)
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() =>
                          setQuals(active ? quals.filter((x) => x !== q) : [...quals, q])
                        }
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-xs transition-all',
                          active
                            ? 'border-brand-purple/40 bg-brand-purple/10 text-brand-purpleLight'
                            : 'border-white/[0.08] bg-background-tertiary text-text-secondary hover:border-brand-purple/30',
                        )}
                      >
                        {active ? <Check className="mr-1 inline h-3 w-3" /> : null}
                        {q}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
            <EyebrowLabel>Details</EyebrowLabel>
            <Label htmlFor="desc" className="mt-3 block">
              Describe the role
            </Label>
            <Textarea
              id="desc"
              rows={7}
              placeholder="What will they be cutting? What\u2019s the timeline? Any must-haves or deal-breakers?"
              {...register('description')}
            />
            {errors.description ? (
              <p className="mt-1 text-xs text-status-danger">{errors.description.message}</p>
            ) : null}
          </section>

          <div className="flex justify-end">
            <GradientButton type="submit" size="lg" loading={isSubmitting}>
              Submit for review
            </GradientButton>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-1">
          <section className="sticky top-4 rounded-2xl border border-white/[0.06] bg-background-secondary p-6">
            <EyebrowLabel>Tip</EyebrowLabel>
            <p className="mt-2 text-sm text-text-secondary">
              The best-performing postings are specific: name the show, the deliverable,
              and the one thing you care most about. Vague posts get vague applicants.
            </p>
          </section>
        </aside>
      </form>

      <JobTypeSelector
        open={empOpen}
        onClose={() => setEmpOpen(false)}
        value={employment}
        onChange={(v) => setEmployment(v)}
      />
    </div>
  )
}
