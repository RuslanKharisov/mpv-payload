import Link from 'next/link'
import React from 'react'

import { Button } from '@/shared/ui/button'

export default function NotFound() {
  return (
    <div className="container py-28 text-center">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0, fontSize: '4rem' }}>404</h1>
        <p className="mb-4 text-lg text-muted-foreground">Упс! Похоже, вы забрели не туда 🚀</p>
        <p className="mb-6 text-muted-foreground">
          Но ничего страшного — вернёмся на главную и продолжим путешествие.
        </p>
      </div>
      <Button asChild variant="default">
        <Link href="/">На главную</Link>
      </Button>
    </div>
  )
}
