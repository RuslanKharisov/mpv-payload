import { EmailLoginForm } from '@/features/auth/_ui/email-login-form'
import { redirect } from 'next/navigation'
import { caller } from '@/trpc/server'

async function page() {
  const session = await caller.auth.session()
  if (session?.user) {
    // Если пользователь уже авторизован, перенаправляем его на главную страницу
    redirect('/')
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <EmailLoginForm />
    </div>
  )
}

export default page
