'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTRPC } from '@/shared/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/shared/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Button } from '@/shared/ui/button'
import { Spinner } from '@/shared/ui/spinner'
import PolicyLink from '@/shared/ui/policy-link'
import {
  BillingRequestFormSchema,
  type BillingRequestFormValues,
} from '@/entities/billing-request/_domain/schemas'

interface BillingRequestModalProps {
  tariffId: number
  tariffName: string
  triggerLabel: string
}

export function BillingRequestModal({
  tariffId,
  tariffName,
  triggerLabel,
}: BillingRequestModalProps) {
  const [open, setOpen] = useState(false)
  const trpc = useTRPC()

  const form = useForm<BillingRequestFormValues>({
    resolver: zodResolver(BillingRequestFormSchema),
    mode: 'onChange',
    defaultValues: {
      companyName: '',
      email: '',
      phone: '',
      note: '',
      website: '',
    },
  })

  const { mutate, isPending } = useMutation(
    trpc.billingRequest.sendBillingRequest.mutationOptions({
      onSuccess: () => {
        toast.success('Заявка успешно отправлена', {
          description: 'Мы свяжемся с вами для обсуждения тарифа.',
        })
        form.reset()
        setOpen(false)
      },
      onError: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Пожалуйста, попробуйте еще раз.'
        toast.error('Ошибка при отправке заявки', { description: message })
      },
    }),
  )

  const onSubmit = (data: BillingRequestFormValues) => {
    if (data.website?.trim()) return

    const { website: _website, ...safeData } = data

    mutate({
      tariffId,
      tariffName,
      formData: safeData,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-6">{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Заявка на тариф «{tariffName}»</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Название компании <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название вашей компании" {...field} />
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
                  <FormLabel>
                    Email <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="Введите ваш email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="По желанию, для оперативной связи" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комментарий</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Расскажите о задаче, объёмах, интересующих функциях"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* honeypot */}
            <input
              type="text"
              {...form.register('website')}
              autoComplete="off"
              tabIndex={-1}
              className="h-px w-px opacity-0 overflow-hidden"
              aria-hidden="true"
            />

            <DialogFooter className="sm:flex-col pt-4 gap-4">
              <Button type="submit" disabled={isPending || !form.formState.isValid}>
                {isPending && <Spinner className="mr-2 h-4 w-4" />}
                Отправить заявку
              </Button>
              <PolicyLink title="Отправить заявку" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
