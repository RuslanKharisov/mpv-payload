import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Typography } from '@/shared/ui/typography'
import { Badge } from '@/shared/ui/badge'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { getActiveTenantId } from '@/payload/access/hasActiveFeature'
import { CheckIcon } from 'lucide-react'
import Link from 'next/link'
import type { Tariff, Subscription } from '@/payload-types'
import { BillingRequestModal } from '@/features/billing-request/_ui/billing-request-modal'

async function TariffsPage() {
  const payload = await getPayload({ config: configPromise })

  // Получаем текущего пользователя
  const { user } = await getMeUser({ nullUserRedirect: '/login' })

  // Определяем активный tenant
  const activeTenantId = getActiveTenantId(user)

  // Загружаем все тарифы
  const tariffs = await payload.find({
    collection: 'tariffs',
  })

  // Получаем текущую подписку tenant'а
  let currentSubscription: Subscription | null = null
  let currentTariff: Tariff | null = null
  let currentTariffId: number | null = null

  if (activeTenantId) {
    const subscriptionsResult = await payload.find({
      collection: 'subscriptions',
      where: {
        tenant: { equals: activeTenantId },
        status: { equals: 'active' },
        endDate: { greater_than_equal: new Date().toISOString() },
      },
      depth: 2,
    })

    if (subscriptionsResult.docs.length > 0) {
      currentSubscription = subscriptionsResult.docs[0] as Subscription
      const tariffRelation = currentSubscription.tariff

      if (typeof tariffRelation === 'object' && tariffRelation !== null) {
        currentTariff = tariffRelation as Tariff
        currentTariffId = currentTariff.id
      } else {
        currentTariffId = tariffRelation as number
        // Находим текущий тариф в списке загруженных
        currentTariff = tariffs.docs.find((t) => t.id === currentTariffId) || null
      }
    }
  }
  console.log('currentTariff ==> ', currentTariff)

  return (
    <div className="space-y-6 px-4 lg:px-6 py-4 md:py-6">
      <div className="text-center space-y-3">
        <Typography tag="h1">Цены</Typography>
        <Typography tag="p" className="text-sm text-muted-foreground mt-1">
          Выберите подходящий тариф
        </Typography>
        {currentTariff && (
          <Badge className="mx-auto text-base md:text-lg">
            Ваш текущий тариф: <span className="font-medium">{currentTariff.name}</span>
            {currentSubscription?.endDate && (
              <> до {new Date(currentSubscription.endDate).toLocaleDateString('ru-RU')}</>
            )}
          </Badge>
        )}
      </div>

      {!currentTariff && (
        <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
          Выберите доступный тариф с лучшими функциями для взаимодействия с аудиторией, повышения
          лояльности клиентов и стимулирования продаж.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {tariffs.docs
          .slice()
          .sort((a, b) => a.id - b.id)
          .map((tariff) => {
            // Определяем состояние для каждого тарифа
            const isCurrent = currentTariffId === tariff.id
            const isUpgrade = currentTariffId ? tariff.price > (currentTariff?.price ?? 0) : false
            const isDowngrade = currentTariffId ? tariff.price < (currentTariff?.price ?? 0) : false

            return (
              <Card
                key={tariff.id}
                className={`flex flex-col ${isCurrent ? 'border-destructive' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{tariff.name}</CardTitle>
                      <CardDescription>{tariff.description}</CardDescription>
                    </div>
                    {isCurrent && <Badge variant="destructive">Текущий тариф</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex items-baseline gap-x-2">
                    <span className="text-4xl font-bold tracking-tight">{tariff.price}</span>
                    <span className="text-sm text-muted-foreground">/месяц</span>
                  </div>

                  <ul role="list" className="mt-6 space-y-3 text-sm flex-1">
                    {tariff.benefits?.map((benefit) => (
                      <li key={benefit.id} className="flex gap-x-3">
                        <CheckIcon aria-hidden="true" className="h-5 w-5 flex-none text-primary" />
                        <span className="text-muted-foreground">{benefit.value}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    ''
                  ) : // <Button asChild variant="outline" className="w-full mt-6">
                  //   <Link href="/suppliers/billing">Управлять подпиской</Link>
                  // </Button>
                  tariff.price === 0 ? (
                    <Button asChild className="w-full mt-6">
                      <Link href="/suppliers/billing">Перейти на бесплатный тариф</Link>
                    </Button>
                  ) : (
                    <BillingRequestModal
                      tariffId={tariff.id}
                      tariffName={tariff.name}
                      triggerLabel={
                        isUpgrade
                          ? 'Оставить заявку на этот тариф'
                          : isDowngrade
                            ? 'Оставить заявку на более простой тариф'
                            : 'Оставить заявку'
                      }
                    />
                  )}
                </CardContent>
              </Card>
            )
          })}
      </div>
    </div>
  )
}

export default TariffsPage
