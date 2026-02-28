'use client'

import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { useTRPC } from '@/shared/trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit3 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TenantUpdateSchema, type TenantUpdateInput } from '@/entities/tenants/_domain/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { SupplierDashboardTenant } from '@/entities/dashboard/model/types'

interface UpdateTenantDialogProps {
  tenant: SupplierDashboardTenant | null
  children?: React.ReactNode
  onTenantUpdated?: (updatedTenant: SupplierDashboardTenant) => void
}

export function UpdateTenantDialog({ tenant, children, onTenantUpdated }: UpdateTenantDialogProps) {
  const [open, setOpen] = useState(false)
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const form = useForm<TenantUpdateInput>({
    resolver: zodResolver(TenantUpdateSchema),
    defaultValues: {
      id: tenant?.id,
      name: tenant?.name || '',
      requestEmail: tenant?.requestEmail || '',
      domain: tenant?.domain || '',
    },
  })

  // Reset form when tenant prop changes
  useEffect(() => {
    form.reset({
      id: tenant?.id,
      name: tenant?.name || '',
      requestEmail: tenant?.requestEmail || '',
      domain: tenant?.domain || '',
    })
  }, [tenant, form])

  const { handleSubmit, reset } = form

  const { mutateAsync, isPending } = useMutation(
    trpc.tenants.updateOrCreateTenant.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.dashboard.getSupplierSummary.queryOptions())
        toast.success('Данные компании успешно обновлены')
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Ошибка при обновлении данных компании'
        toast.error('Ошибка при обновлении данных компании', {
          description: errorMessage,
        })
      },
    }),
  )

  const onSubmit = async (data: TenantUpdateInput) => {
    try {
      const updatedTenant = await mutateAsync(data)
      onTenantUpdated?.(updatedTenant)
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Error updating tenant:', error)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset()
    }
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" className="">
            Редактировать <Edit3 className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tenant ? 'Редактировать компанию' : 'Создать компанию'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название компании *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Введите название компании"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email для заявок *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="Введите email для заявок" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Домен компании</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Введите домен компании (необязательно)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  reset()
                }}
                disabled={isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Сохранение...' : tenant ? 'Обновить' : 'Создать'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
