'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/shared/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTRPC } from '@/shared/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SupplierDashboardTenant } from '@/entities/dashboard/model/types'
import { TenantUpdateSchema } from '@/entities/tenants/_domain/schemas'
import { z } from 'zod'
import { TENANT_STATUS_LABELS } from '@/shared/constants/tenant-status'
import InnInput from './ui/inn-input'

const CompleteTenantSchema = TenantUpdateSchema.pick({
  id: true,
  name: true,
  requestEmail: true,
}).extend({
  company: z.object({
    inn: z.string().min(10).max(12),
    name: z.string().min(2),
    status: z
      .enum(['ACTIVE', 'LIQUIDATING', 'LIQUIDATED', 'BANKRUPT', 'REORGANIZING'])
      .optional()
      .nullable(),
  }),
})

type CompleteTenantInput = z.infer<typeof CompleteTenantSchema>

interface Props {
  tenant: SupplierDashboardTenant
}

export function CompleteCompanyModal({ tenant }: Props) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const form = useForm<CompleteTenantInput>({
    resolver: zodResolver(CompleteTenantSchema),
    defaultValues: {
      id: tenant.id,
      name: tenant.name ?? '',
      requestEmail: tenant.requestEmail ?? '',
      company: {
        inn: '',
        name: tenant.name ?? '',
      },
    },
  })

  const { mutateAsync, isPending } = useMutation(
    trpc.tenants.updateOrCreateTenant.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.dashboard.getSupplierSummary.queryOptions())
      },
    }),
  )

  const onSubmit = async (data: CompleteTenantInput) => {
    const { company, ...base } = data

    if (company.status && company.status !== 'ACTIVE') {
      form.setError('company', {
        message: 'Нельзя использовать недействующую компанию (статус: ' + company.status + ').',
      })
      return
    }

    try {
      await mutateAsync({
        id: base.id,
        name: company.name,
        requestEmail: base.requestEmail,
        domain: tenant.domain ?? '',
        inn: company.inn,
        status: company.status,
      })
    } catch (error) {
      console.error('Ошибка при обновлении данных компании:', error)
      // Optionally show user-facing error notification
      // toast.error('Ошибка при сохранении данных компании')
    }
  }

  return (
    <Dialog open>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Завершите регистрацию компании</DialogTitle>
          <DialogDescription>Начните вводить ИНН и выберите компанию из списка</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ИНН + выбор компании из DaData */}
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => {
                const selectedName = field.value?.name
                const status = field.value?.status as
                  | 'ACTIVE'
                  | 'LIQUIDATING'
                  | 'LIQUIDATED'
                  | 'BANKRUPT'
                  | 'REORGANIZING'
                  | undefined

                return (
                  <FormItem>
                    <FormLabel className="mb-2">ИНН компании *</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <InnInput field={field} placeholder="Введите ИНН и выберите компанию" />

                        {selectedName && (
                          <div className="text-xs text-muted-foreground">
                            <div>
                              Компания: <span className="font-medium">{selectedName}</span>
                            </div>
                            {status && (
                              <div>
                                Статус:{' '}
                                <span
                                  className={
                                    status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                                  }
                                >
                                  {TENANT_STATUS_LABELS[
                                    status as keyof typeof TENANT_STATUS_LABELS
                                  ] ?? status}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Сохранение...' : 'Сохранить данные компании'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
