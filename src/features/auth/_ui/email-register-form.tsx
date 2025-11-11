'use client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema } from '@/entities/user'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { FormEroor } from '@/shared/ui/form-error'
import { useTRPC } from '@/shared/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Typography } from '@/shared/ui/typography'
import BackButton from './back-button'
import PolicyLink from '@/shared/ui/policy-link'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export function EmailRegisterForm() {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [confirmationSent, setConfirmationSent] = useState(false)

  const {
    mutate: registerUser,
    isError,
    error,
    isPending,
  } = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        setConfirmationSent(true)
      },
    }),
  )

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
      website: '',
      recaptchaToken: '',
    },
  })

  useEffect(() => {
    if (executeRecaptcha) {
      console.log('reCAPTCHA is ready')
      // Можно снять ошибку, если была
      form.clearErrors('recaptchaToken')
    } else {
      console.log('reCAPTCHA is not ready yet')
    }
  }, [executeRecaptcha, form])

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    if (!executeRecaptcha) {
      console.error('reCAPTCHA not loaded')
      return
    }
    if (data.website?.trim() !== '') {
      return
    }
    try {
      const recaptchaToken = await executeRecaptcha('submit_form')

      if (!recaptchaToken) {
        console.error('Failed to generate reCAPTCHA token')
        form.setError('root', {
          message:
            'reCAPTCHA еще не загружена. Пожалуйста, подождите несколько секунд и попробуйте снова.',
        })
        return
      }

      const formDataWithToken = {
        ...data,
        recaptchaToken,
      }

      registerUser(formDataWithToken)
    } catch (error) {
      console.error('reCAPTCHA error:', error)
      form.setError('root', {
        message: 'Произошла ошибка при проверке reCAPTCHA. Пожалуйста, попробуйте еще раз.',
      })
      return
    }
  }

  if (confirmationSent) {
    return (
      <div className="p-6 rounded-lg border bg-card">
        <h2 className="text-xl font-semibold mb-2">Почти готово!</h2>
        <p className="mb-4">
          Мы отправили письмо с подтверждением на указанную почту. Чтобы завершить регистрацию,
          перейдите по ссылке в письме.
        </p>
        <p className="text-sm text-muted-foreground">
          Не получили письмо? Проверьте папку <i>Спам</i>.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm underline">
          Вернуться на главную
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <Typography variant="inter-bold-32" className="text-center mb-5">
        Регистрация
      </Typography>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Имя пользователя</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваше Имя пользователя" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Почта</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Пароль</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <input
              type="text"
              {...form.register('website')}
              autoComplete="off"
              tabIndex={-1}
              className=" h-px w-px opacity-0 overflow-hidden"
              aria-hidden="true"
            />

            {/* {data?.error && <FormEroor message={data?.error} />} */}
            {isError && <FormEroor message={error.message} />}
            {/* {data?.success && <FormSuccess message={data?.success} />} */}
            {/* <Button size="sm" variant="link" asChild className="px-0 font-normal"> */}
            <Link href="/admin/forgot" className=" text-xs underline">
              Забыли пароль?
            </Link>
            {/* </Button> */}
            <Button variant="secondary" type="submit" disabled={isPending}>
              {isPending && <Spinner className="mr-2 h-4 w-full " aria-label="Загрузка выхода" />}
              Продолжить
            </Button>
            <BackButton href="/login" label="Уже зарегистрированы? Войти." />
          </div>
        </form>
      </Form>
      <PolicyLink title="Продолжить" />
    </div>
  )
}
