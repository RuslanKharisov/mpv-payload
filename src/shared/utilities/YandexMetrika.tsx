'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, Suspense } from 'react'
import ym, { YMInitializer } from 'react-yandex-metrika'

type Props = {
  enabled: boolean
}

const RAW_ID = process.env.NEXT_PUBLIC_YM_COUNTER_ID
const YM_COUNTER_ID = RAW_ID ? Number(RAW_ID) : null

// Внутренний компонент для отслеживания переходов
// Выделен отдельно, чтобы использовать Suspense (требование Next.js для useSearchParams)
const MetrikaTracker = ({ enabled }: { enabled: boolean }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!YM_COUNTER_ID) return

    const search = searchParams.toString()
    const url = pathname + (search ? `?${search}` : '')

    if (enabled) {
      ym('hit', url)
    } else {
      console.log(`%c[YandexMetrika](HIT)`, `color: orange`, url)
    }
  }, [pathname, searchParams, enabled])

  return null
}

const YandexMetrikaContainer: React.FC<Props> = ({ enabled }) => {
  // Если метрика выключена или нет ID, вообще ничего не рендерим
  if (!enabled || !YM_COUNTER_ID) {
    return null
  }

  return (
    <>
      {/* Suspense обязателен в App Router при использовании useSearchParams */}
      <Suspense fallback={null}>
        <MetrikaTracker enabled={enabled} />
      </Suspense>

      <YMInitializer
        accounts={[YM_COUNTER_ID]}
        options={{
          defer: true, // Позволяет нам вручную отправлять 'hit' через useEffect
          webvisor: true,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
        }}
        version="2"
      />
    </>
  )
}

export default YandexMetrikaContainer
