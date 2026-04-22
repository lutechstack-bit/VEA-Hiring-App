// Shared domain types for the LevelUp Talent Network.

export type Role = 'editor' | 'partner' | 'admin'
export type UserStatus = 'pending' | 'approved' | 'rejected'
export type Experience = 'Beginner' | 'Intermediate' | 'Advanced'
export type JobType = 'job' | 'gig'
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site'
export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Internship'
  | 'Contract'
  | 'Freelance'
export type BudgetType = 'salary' | 'project'
export type JobStatus = 'pending' | 'approved' | 'rejected'
export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Hired' | 'Rejected'
export type Tag = 'Verified' | 'Top Performer' | 'Placement Ready'

export interface UserRow {
  id: string
  email: string
  role: Role
  name: string
  status: UserStatus
  created_at: string
  approved_at: string | null
  approved_by: string | null
}

export interface PortfolioLink {
  label: string
  url: string
}

export interface ProfileRow {
  user_id: string
  bio: string | null
  location: string | null
  experience: Experience | null
  skills: string[]
  portfolio_links: PortfolioLink[]
  tags: Tag[]
  website: string | null
  avatar_url: string | null
  qualifications: string[]
  updated_at: string
}

export interface JobRow {
  id: string
  posted_by: string
  type: JobType
  employment_type: EmploymentType | null
  title: string
  company: string
  location: string
  work_mode: WorkMode
  budget: string
  budget_type: BudgetType | null
  description: string
  skills: string[]
  qualifications: string[]
  experience: Experience
  status: JobStatus
  created_at: string
  approved_at: string | null
}

export interface ApplicationRow {
  id: string
  job_id: string
  editor_id: string
  status: ApplicationStatus
  note: string | null
  created_at: string
  updated_at: string
}

export interface MessageRow {
  id: string
  thread_id: string
  from_user_id: string
  to_user_id: string
  text: string
  created_at: string
  read_at: string | null
}

export interface SavedJobRow {
  id: string
  editor_id: string
  job_id: string
  created_at: string
}

export interface ActivityRow {
  id: string
  actor_id: string | null
  action: string
  target_type: string | null
  target_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

// Minimal Database typing for supabase-js generic.
// Covers the shape used by our queries without pulling in code-gen.
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow
        Insert: Partial<UserRow> & { id: string; email: string; role: Role; name: string }
        Update: Partial<UserRow>
      }
      profiles: {
        Row: ProfileRow
        Insert: Partial<ProfileRow> & { user_id: string }
        Update: Partial<ProfileRow>
      }
      jobs: {
        Row: JobRow
        Insert: Omit<JobRow, 'id' | 'created_at' | 'approved_at' | 'status'> & {
          status?: JobStatus
        }
        Update: Partial<JobRow>
      }
      applications: {
        Row: ApplicationRow
        Insert: Omit<ApplicationRow, 'id' | 'created_at' | 'updated_at' | 'status'> & {
          status?: ApplicationStatus
        }
        Update: Partial<ApplicationRow>
      }
      messages: {
        Row: MessageRow
        Insert: Omit<MessageRow, 'id' | 'created_at' | 'read_at'>
        Update: Partial<MessageRow>
      }
      saved_jobs: {
        Row: SavedJobRow
        Insert: Omit<SavedJobRow, 'id' | 'created_at'>
        Update: Partial<SavedJobRow>
      }
      activity_log: {
        Row: ActivityRow
        Insert: Omit<ActivityRow, 'id' | 'created_at'>
        Update: Partial<ActivityRow>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// View-model helpers --------------------------------------------------------
export interface JobWithPoster extends JobRow {
  poster?: Pick<UserRow, 'id' | 'name'>
}

export interface EditorProfileView extends ProfileRow {
  user: Pick<UserRow, 'id' | 'name' | 'email' | 'status' | 'role'>
}

export interface ApplicationWithJob extends ApplicationRow {
  job: JobRow
}

export interface ApplicationWithEditor extends ApplicationRow {
  editor: Pick<UserRow, 'id' | 'name' | 'email'>
  profile: ProfileRow | null
}
