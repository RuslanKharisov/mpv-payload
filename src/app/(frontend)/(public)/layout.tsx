import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/widgets/footer/Component'
import { Header } from '@/widgets/header/Component'
import { draftMode } from 'next/headers'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  return (
    <>
      <AdminBar
        adminBarProps={{
          preview: isEnabled,
        }}
      />
      <Header />
      <main className="w-full">{children}</main>
      <Footer />
    </>
  )
}
