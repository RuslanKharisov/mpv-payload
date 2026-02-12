'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { useState } from 'react'
import { Textarea } from '@/shared/ui/textarea'
import { toast } from 'sonner'
import {
  GeneralSearchRequestValues,
  GeneralSearchSchema,
} from '@/entities/search-request/_domain/schemas'
import { sendGeneralSearchRequest } from '../api/send-general-request'
import PolicyLink from '@/shared/ui/policy-link'

export function GeneralSearchModal({ trigger }: { trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof GeneralSearchSchema>>({
    resolver: zodResolver(GeneralSearchSchema),
    defaultValues: {
      productName: '',
      email: '',
      phone: '',
      companyName: '',
      note: '',
      website: '',
    },
  })

  const onSubmit = async (data: GeneralSearchRequestValues) => {
    if (data.website) return

    setIsPending(true)
    const result = await sendGeneralSearchRequest(data)
    setIsPending(false)

    if (result.success) {
      toast.success('Заявка принята!')
      setIsOpen(false)
      form.reset()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || <Button>Оставить заявку</Button>}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Не нашли нужное оборудование?</DialogTitle>
          <DialogDescription>
            Опишите, что вы ищете, и мы найдем это в излишках предприятий.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Артикул или наименование *</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: Siemens 6ES7..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Компания *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                      <Input type="tel" placeholder="+7 (___) ___-__-__" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комментарий</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Количество, состояние, бюджет..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Honeypot */}
            <input
              type="text"
              {...form.register('website')}
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <PolicyLink title="Отправить запрос" />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Отправка...' : 'Отправить запрос на поиск'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
