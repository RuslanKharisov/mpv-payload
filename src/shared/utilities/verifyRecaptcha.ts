export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not set')
    return false
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (!res.ok) {
      console.error('reCAPTCHA API returned non-OK status:', res.status)
      return false
    }

    const data = await res.json()

    return data.success && data.score > 0.6
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error)
    return false
  }
}
