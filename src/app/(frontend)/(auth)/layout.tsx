import { Suspense } from 'react'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>{children}</Suspense>
    </>
  )
}
