import { Typography } from '@/shared/ui/typography'
import { SearchParams } from 'next/dist/server/request/search-params'

interface Props {
  searchParams: Promise<SearchParams>
  params: Promise<{ slug: string }>
}

export default async function page({ params }: Props) {
  const { slug } = await params

  return (
    <div className="container mx-auto text-center">
      <Typography variant="inter-bold-32">Поставщик: {slug}</Typography>
    </div>
  )
}
