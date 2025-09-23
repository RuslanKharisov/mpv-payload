'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/shared/trpc/client'

export default function VerifyPage() {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  const { mutate: verify } = useMutation(
    trpc.auth.verifyEmail.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        router.push('/login')
      },
    }),
  )

  useEffect(() => {
    if (!token || !email) {
      setStatus('error')
      return
    }
    verify({ token, email })
  }, [token, email])

  return (
    <Suspense>
      <div className="flex h-screen items-center justify-center">
        {status === 'loading' && <p>Проверяем ваш email...</p>}
        {status === 'success' && <p>✅ Email успешно подтверждён!</p>}
        {status === 'error' && <p>❌ Ошибка при подтверждении.</p>}
      </div>
    </Suspense>
  )
}
