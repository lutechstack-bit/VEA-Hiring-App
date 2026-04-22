import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  MessageSquare,
  Shield,
  Sparkles,
  Target,
  Users,
  Video,
} from 'lucide-react'
import { GradientButton } from '@/components/shared/GradientButton'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'
import { Card } from '@/components/shared/Card'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <nav className="sticky top-0 z-30 border-b border-white/[0.06] bg-background-primary/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple to-brand-purpleDeep">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">LevelUp</span>
            <span className="hidden text-xs text-text-muted sm:inline">
              Talent Network
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Sign in
            </Link>
            <Link to="/auth?mode=signup">
              <GradientButton size="sm">Get started</GradientButton>
            </Link>
          </div>
        </div>
      </nav>

      <section className="page-hero relative overflow-hidden">
        <div className="mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6 sm:py-28">
          <EyebrowLabel>The Network</EyebrowLabel>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-medium leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            A <span className="bg-gradient-to-r from-brand-purpleLight to-brand-purple bg-clip-text text-transparent">curated</span> talent network for video editors and hiring partners in India.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-text-secondary sm:text-lg">
            Every editor and partner is verified by an admin. No cold outreach, no spam — just
            real work with real people.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/auth?mode=signup&role=editor">
              <GradientButton size="lg" className="w-full sm:w-auto">
                Join as editor <ArrowRight className="h-4 w-4" />
              </GradientButton>
            </Link>
            <Link to="/auth?mode=signup&role=partner">
              <GradientButton variant="outline" size="lg" className="w-full sm:w-auto">
                Hire an editor
              </GradientButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <EyebrowLabel>Why LevelUp</EyebrowLabel>
        <h2 className="mt-2 max-w-2xl text-2xl font-medium tracking-tight text-text-primary sm:text-3xl">
          Built for serious editors, not quantity.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Feature
            icon={BadgeCheck}
            title="Verified only"
            description="Every profile is reviewed by an admin. Partners only see real editors with real reels."
          />
          <Feature
            icon={Target}
            title="Matched by skill"
            description="Easy Apply when your skills match — see exactly where your profile fits a role."
          />
          <Feature
            icon={MessageSquare}
            title="Direct conversation"
            description="Real-time messaging once an application is made. No middlemen, no gatekeeping."
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              n: '01',
              title: 'Apply to join',
              body: 'Tell us about your work. Add your reel, pick your skills, set your level.',
              icon: Users,
            },
            {
              n: '02',
              title: 'Get verified',
              body: 'An admin reviews your profile. Approved editors are placement-ready.',
              icon: Shield,
            },
            {
              n: '03',
              title: 'Find real work',
              body: 'Browse jobs and gigs posted by verified partners. Apply in one click.',
              icon: Sparkles,
            },
          ].map((s) => (
            <Card key={s.n} size="hero" className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-purple/20 bg-brand-purple/10 px-3 py-1 text-xs text-brand-purpleLight">
                Step {s.n}
              </div>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purpleLight">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-background-secondary p-10 text-center">
          <div
            aria-hidden
            className="absolute inset-0 bg-radial-purple"
          />
          <div className="relative">
            <Video className="mx-auto mb-4 h-8 w-8 text-brand-purpleLight" />
            <h3 className="text-2xl font-medium sm:text-3xl">
              Ready to level up?
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-text-secondary">
              Create your profile today. We usually verify within 24 hours.
            </p>
            <div className="mt-6 flex justify-center">
              <Link to="/auth?mode=signup">
                <GradientButton size="lg">
                  Get started <ArrowRight className="h-4 w-4" />
                </GradientButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} LevelUp Talent Network · Built for editors in India
      </footer>
    </div>
  )
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Card>
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purpleLight">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-medium text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </Card>
  )
}
