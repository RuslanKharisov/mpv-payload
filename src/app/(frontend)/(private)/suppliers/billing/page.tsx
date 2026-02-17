import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Typography } from '@/shared/ui/typography'
import configPromise from '@payload-config'
import { CheckIcon } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'

async function TariffsPage() {
  const payload = await getPayload({ config: configPromise })

  const tariffs = await payload.find({
    collection: 'tariffs',
  })

  return (
    <div className="space-y-6 px-4 lg:px-6 py-4 md:py-6">
      <div className="text-center">
        <Typography tag="h1">Цены</Typography>
        <Typography tag="p" className="text-sm text-muted-foreground mt-1">
          Выберите подходящий тариф
        </Typography>
      </div>

      <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
        Выберите доступный тариф с лучшими функциями для взаимодействия с аудиторией, повышения
        лояльности клиентов и стимулирования продаж.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tariffs.docs.map((tariff) => (
          <Card key={tariff.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{tariff.name}</CardTitle>
              <CardDescription>{tariff.description}</CardDescription>
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

              <Button asChild className="w-full mt-6">
                <Link href={`/tariffs/${tariff.id}`}>Выбрать тариф</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TariffsPage
