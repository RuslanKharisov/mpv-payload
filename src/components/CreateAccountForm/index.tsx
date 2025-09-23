'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Input } from './_ui/input'
import { Button } from '@/shared/ui/button'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  //   const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const message = response.statusText || 'There was an error creating the account.'
        setError(message)
        return
      }

      // const redirect = searchParams.get('redirect')

      // const timer = setTimeout(() => {
      //   setLoading(true)
      // }, 1000)
    },
    [router, searchParams],
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
      {/* <Message className={classes.message} error={error} /> */}
      <Input
        error={errors.email}
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
        validate={(value) => value === password.current || 'The passwords do not match'}
      />
      <Button
        // appearance="primary"
        // className={classes.submit}
        // label={loading ? 'Processing' : 'Create Account'}
        type="submit"
      >
        Create Account
      </Button>
      <div>
        {'Already have an account? '}
        <Link href={`/login${allParams}`}>Login</Link>
      </div>
    </form>
  )
}
