'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { LoginSchema } from '@/entities/user/_domain/schemas'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import Link from 'next/link'

import { useTRPC } from '@/shared/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import BackButton from './back-button'
import { Typography } from '@/shared/ui/typography'
import PolicyLink from '@/shared/ui/policy-link'

export function EmailLoginForm() {
  const router = useRouter()

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate: loginUser, isPending } = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        router.push('/admin')
      },
    }),
  )

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    console.log('login data: ', data)
    loginUser(data)
  }

  return (
    <div className="w-full max-w-md">
      <Typography variant="inter-bold-32" className="text-center mb-5">
        Войти
      </Typography>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
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
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
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
                    <Input
                      placeholder="******"
                      type="password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <Link href="/admin/forgot" className=" text-xs underline">
                    Забыли пароль?
                  </Link>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormEroor message={errorMsg ? 'Не верные данные' : ''} /> */}
            {/* <FormSuccess message={success} /> */}
            <Button variant="secondary" type="submit" disabled={isPending}>
              {isPending && <Spinner className="mr-2 h-4 w-full " aria-label="Загрузка выхода" />}
              Продолжить
            </Button>
            <BackButton href="/register" label="Нет аккаунта? Зарегистрироваться." />
          </div>
        </form>
      </Form>
      <PolicyLink title="Продолжить" />
    </div>
  )
}
