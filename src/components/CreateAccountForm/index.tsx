'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/button'
import { Input } from './_ui/input'

type FormData = {
  username: string // добавил, так как в инпуте есть name="username"
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const router = useRouter()

  // Теперь эти переменные используются в onSubmit и в JSX
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const passwordValue = watch('password', '')
  // const passwordRef = useRef({})
  // passwordRef.current = passwordValue

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true) // Используем setLoading
      setError(null) // Сбрасываем старые ошибки

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })

        if (!response.ok) {
          const message = 'There was an error creating the account.'
          setError(message) // Используем setError
          return
        }

        // Если успех, редиректим на логин или дашборд
        // Validate redirect to prevent open redirect vulnerabilities
        const rawRedirect = searchParams.get('redirect')
        const isValidRedirect = (value: string): boolean => {
          // Must start with single '/' and not contain '://' or start with '//'
          return /^\/(?!\/)/.test(value) && !value.includes('://')
        }
        const redirect = rawRedirect && isValidRedirect(rawRedirect) ? rawRedirect : '/account'
        router.push(redirect)
      } catch (_err) {
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [router, searchParams], // Зависимости теперь честные
  )

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <p>
        {`This is where new customers can signup and create a new account. To manage all users, `}
        <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/users`}>
          login to the admin dashboard
        </Link>
        .
      </p>

      {/* Выводим ошибку, если она есть */}
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <Input
        error={errors.username} // Исправил с email на username
        label="User Name"
        name="username"
        register={register}
        required
        type="text"
      />
      <Input
        error={errors.email}
        label="Email Address"
        name="email"
        register={register}
        required
        type="email"
      />
      <Input
        error={errors.password}
        label="Password"
        name="password"
        register={register}
        required
        type="password"
      />
      <Input
        error={errors.passwordConfirm}
        label="Confirm Password"
        name="passwordConfirm"
        register={register}
        required
        type="password"
        validate={(value) => value === passwordValue || 'The passwords do not match'}
      />

      <Button
        type="submit"
        disabled={loading} // Блокируем кнопку при загрузке
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <div style={{ marginTop: '1rem' }}>
        {'Already have an account? '}
        <Link href={`/login${allParams}`}>Login</Link>
      </div>
    </form>
  )
}
