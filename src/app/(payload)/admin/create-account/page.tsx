import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Suspense, use } from 'react'

import configPromise from '@payload-config'
import { CreateAccountForm } from '@/components/CreateAccountForm'

export default async function CreateAccount() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  console.log('user ==> ', user)

  // if (user) {
  //   redirect(
  //     `/account?message=${encodeURIComponent(
  //       'Cannot create a new account while logged in, please log out and try again.',
  //     )}`,
  //   )
  // }

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
