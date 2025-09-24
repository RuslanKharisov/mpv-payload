'use client'

import { Button } from '@/shared/ui/button'
import Link from 'next/link'

const LoginButton = () => {
  return (
    <Link href="/login" className="text-sm underline">
      <Button variant="secondary">Войти</Button>
    </Link>
  )
}

export { LoginButton }
