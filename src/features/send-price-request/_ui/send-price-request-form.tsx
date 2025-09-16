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
      firstName: '',
      lastName: '',
      phone: '+7',
      email: '',
      companyName: '',
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
    console.log('Отправляем запрос поставщику:', tenantEmail)

    sendRequest({
      tenantName,
      tenantEmail,
      formData: data,
      items: items.map(mapCartEntryToPriceRequestItem),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full">
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
                {item.sku} ({item.manufacturer})
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
            <div className="font-semibold text-black">Детали запроса</div>

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
                      placeholder="Tell us a little bit about yourself"
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
            <div className="font-semibold text-black">Контактные данные</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Имя <span className="text-danger">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Введите ваше имя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Фамилия <span className="text-danger">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Введите вашу фамилию" {...field} />
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
                    <FormLabel className="text-sm">
                      Номер телефона <span className="text-danger">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        autoComplete="mobile tel-country-code"
                        placeholder="Введите номер телефона"
                        {...field}
                      />
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
            </div>

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

            {/* Кнопка отправки */}
            <DialogFooter className="pt-4">
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
