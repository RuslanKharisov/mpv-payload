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
import { FormSuccess } from '@/shared/ui/form-success'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'

export function EmailRegisterForm() {
  const trpc = useTRPC()
  const {
    mutate: registerUser,
    isError,
    error,
    data,
    isPending,
  } = useMutation(trpc.auth.register.mutationOptions())

  console.log('isError ==> ', isError)
  console.log('error ==> ', error)
  console.log('data ==> ', data)

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  })

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    registerUser(data)
  }

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваше Имя" disabled={isPending} {...field} />
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
                  <FormLabel>Почта</FormLabel>
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
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* {data?.error && <FormEroor message={data?.error} />} */}
            {isError && <FormEroor message={error.message} />}
            {/* {data?.success && <FormSuccess message={data?.success} />} */}
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner className="mr-2 h-4 w-full " aria-label="Загрузка выхода" />}
              Продолжить
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
