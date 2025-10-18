import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-dvh text-white bg-[radial-gradient(1200px_600px_at_-10%_-10%,#0f2337_0%,#0b1016_55%)]">
      <main className="mx-auto max-w-[1200px] px-6 sm:px-10 py-12 sm:py-16">
        <Outlet />
      </main>
    </div>
  )
}
