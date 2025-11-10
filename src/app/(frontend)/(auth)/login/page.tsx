import { EmailLoginForm } from '@/features/auth/_ui/email-login-form'
import { generateMeta } from '@/shared/utilities/generateMeta'
import { Metadata } from 'next'

async function page() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <EmailLoginForm />
    </div>
  )
}

export default page

export async function generateMetadata(): Promise<Metadata> {
  const pseudoDoc = {
    meta: {
      title: 'Страница входа в админ панель | Prom-Stock',
      description: 'Вход для поставщиков.',
    },
  }

  return generateMeta({ doc: pseudoDoc })
}
