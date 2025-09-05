import { EmailLoginForm } from '@/features/auth/_ui/email-login-form'

async function page() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <EmailLoginForm />
    </div>
  )
}

export default page
