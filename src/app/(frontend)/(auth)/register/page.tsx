import { EmailRegisterForm } from '@/features/auth'

function page() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <EmailRegisterForm />
    </div>
  )
}

export default page
