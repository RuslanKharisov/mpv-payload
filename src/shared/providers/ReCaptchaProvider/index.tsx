'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ReactNode } from 'react'

export const ReCaptchaProvider = ({ children }: { children: ReactNode }) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  if (!siteKey) {
    console.error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set')
    return <>{children}</>
  }
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
