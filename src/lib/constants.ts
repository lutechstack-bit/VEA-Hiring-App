import type { EmploymentType, Experience, Tag, WorkMode } from './types'

export const SKILLS_LIST = [
  'Premiere Pro',
  'Final Cut Pro',
  'DaVinci Resolve',
  'After Effects',
  'Motion Graphics',
  'Color Grading',
  'Sound Design',
  'Multi-cam',
  'Storytelling',
  'Shorts',
  'Music Sync',
  'Photoshop',
  'Illustrator',
  'Cinema 4D',
  'Avid Media Composer',
  'Captioning',
]

export const QUALIFICATIONS_LIST = [
  'Meets a tight deadline',
  'Communicates clearly',
  'Takes feedback well',
  'Works async',
  'Owns story direction',
  'Delivers clean project files',
  'Comfortable with raw footage triage',
  'Hits first-cut on time',
]

export const EXPERIENCE_LEVELS: Experience[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
]

export const WORK_MODES: WorkMode[] = ['Remote', 'Hybrid', 'On-site']

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Internship',
  'Contract',
  'Freelance',
]

export const EMPLOYMENT_TYPE_HINTS: Record<EmploymentType, string> = {
  'Full-time': '40 hrs/week, ongoing',
  'Part-time': 'Fewer than 40 hrs/week',
  Internship: 'Learning-focused, short-term',
  Contract: 'Fixed duration, set scope',
  Freelance: 'Per-project, flexible',
}

export const TAG_LIST: Tag[] = ['Verified', 'Top Performer', 'Placement Ready']

export const QUICK_REPLIES = [
  'Thanks for the note!',
  'Could you share the brief?',
  'What\u2019s the deadline?',
  'I\u2019m available for a call.',
  'Sending a proposal soon.',
]

export const JOB_TYPES = [
  { value: 'job', label: 'Job' },
  { value: 'gig', label: 'Gig' },
] as const

export const TAG_STYLES: Record<Tag, string> = {
  Verified:
    'bg-brand-purple/10 border-brand-purple/30 text-brand-purpleLight',
  'Top Performer':
    'bg-status-warningBg border-status-warning/30 text-status-warning',
  'Placement Ready':
    'bg-status-successBg border-status-success/30 text-status-success',
}
