'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Separator } from '@/shared/ui/separator'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { CartEntry } from '@/entities/cart'
import { Textarea } from '@/shared/ui/textarea'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SendPriceRequestFormValues, SendPriceRequestSchema } from '@/entities/price-request'
import { mapCartEntryToPriceRequestItem } from '../_domain/mapCartEntryToPriceRequestItem'
import { useTRPC } from '@/shared/trpc/client'
import { toast } from 'sonner'
import { deliveryTimeLabels } from '../_domain/deliveryTime'
import PolicyLink from '@/shared/ui/policy-link'

interface SendPriceRequestModalProps {
  tenantName: string
  tenantEmail: string
  items: CartEntry[]
  trigger?: React.ReactNode
}

export function SendPriceRequestModal({
  tenantName,
  tenantEmail,
  items,
  trigger,
}: SendPriceRequestModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const form = useForm<SendPriceRequestFormValues>({
    resolver: zodResolver(SendPriceRequestSchema),
    mode: 'onChange',
    defaultValues: {
      deliveryTime: 'EMERGENCY',
      note: '',
      email: '',
      companyName: '',
      website: '',
    },
  })

  const { mutate: sendRequest, isPending } = useMutation(
    trpc.sendPriceRequest.sendPriceRequest.mutationOptions({
      onSuccess: async () => {
        toast.success('Запрос успешно отправлен!', {
          description: 'Мы свяжемся с вами в ближайшее время.',
        })
        form.reset()
        setIsOpen(false)
      },

      onError: (error) => {
        toast.error('Ошибка при отправке запроса', {
          description: error.message || 'Пожалуйста, попробуйте еще раз.',
        })
      },
    }),
  )

  const onSubmit = async (data: SendPriceRequestFormValues) => {
    if (data.website?.trim() !== '') {
      return
    }

    const { website, ...safeData } = data

    sendRequest({
      tenantName,
      tenantEmail,
      formData: safeData,
      items: items.map(mapCartEntryToPriceRequestItem),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full cursor-pointer">
            Запросить предложение
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-large p-0 shadow-small">
        <DialogHeader className="p-6 border-b border-border">
          <DialogTitle className="text-large font-semibold text-primary-default">
            Запросить информацию о ценах
          </DialogTitle>
          <DialogDescription className="sr-only">
            Поставщик: <span className="font-bold">{tenantName}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Список товаров */}
        <div className="px-6 py-4">
          {items.map(({ item, quantity }) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>
                {item.sku} ({item.brand})
              </span>
              <span>
                {quantity} × {item.currencyCode} {item.price?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Форма */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6 px-6 pb-8"
          >
            <Separator className="border-border" />

            {/* Детали запроса */}
            <p className="font-semibold">Детали запроса</p>

            {/* Предложение за единицу */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deliveryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="deliveryTime" className="text-sm">
                      Срок поставки
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id="deliveryTime">
                          <SelectValue placeholder="Выберите срок поставки" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(deliveryTimeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel className="text-sm">Примечание</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Дополнительные примечания" {...field} /> */}
                    <Textarea
                      placeholder="Дополнительные примечания"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="border-border" />

            {/* Контактные данные */}
            <p className="font-semibold">Контактные данные</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
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
                    <FormLabel className="text-sm">
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

              <input
                type="text"
                {...form.register('website')}
                autoComplete="off"
                tabIndex={-1}
                className="h-px w-px opacity-0 overflow-hidden"
                aria-hidden="true"
              />
            </div>

            {/* Кнопка отправки */}
            <DialogFooter className="pt-4 gap-5 flex-col">
              <PolicyLink title="Отправить запрос" />
              <Button type="submit" disabled={isPending || !form.formState.isValid}>
                {isPending && <Spinner className="mr-2 h-4 w-4" />}
                Отправить запрос
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
