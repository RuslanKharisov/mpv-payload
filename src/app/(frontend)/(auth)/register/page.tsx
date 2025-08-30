import { EmailRegisterForm } from '@/features/auth'
import { redirect } from 'next/navigation'
import { caller } from '@/shared/trpc/server'

async function page() {
  const session = await caller.auth.session()
  if (session?.user) {
    // Если пользователь уже авторизован, перенаправляем его на главную страницу
    redirect('/')
  }
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <EmailRegisterForm />
    </div>
  )
}

export default page
