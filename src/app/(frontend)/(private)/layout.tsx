import { UserProvider } from '@/shared/providers/UserProvider'
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { PrivateHeader } from '@/widgets/private-header'
import { PrivateSidebar } from '@/widgets/private-sidebar'
import { redirect } from 'next/navigation'

// Force dynamic rendering for private routes to ensure cookies() works
export const dynamic = 'force-dynamic'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })

  if (!user) redirect('/login')

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <PrivateSidebar user={user} />
      <SidebarInset>
        <UserProvider user={user}>
          <PrivateHeader />
          {children}
        </UserProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
