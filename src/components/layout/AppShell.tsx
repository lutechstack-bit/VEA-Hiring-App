import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export function AppShell() {
  return (
    <div className="min-h-screen bg-background-primary">
      <Sidebar />
      <MobileNav />
      <main className="md:pl-[260px]">
        <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-4 sm:px-6 md:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
