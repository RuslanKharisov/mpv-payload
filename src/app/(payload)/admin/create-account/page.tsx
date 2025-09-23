import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

import configPromise from '@payload-config'
import { CreateAccountForm } from '@/components/CreateAccountForm'

export default async function CreateAccount() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="container py-10 mx-auto">
      <h1>Create Account</h1>
      {JSON.stringify(user)}

      <Suspense fallback={<>...</>}>
        <CreateAccountForm />
      </Suspense>
    </div>
  )
}
