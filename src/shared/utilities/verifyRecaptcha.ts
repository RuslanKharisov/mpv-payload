export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not set')
    return false
  }

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
  })

  const data = await res.json()

  console.log('reCAPTCHA verification result:', {
    success: data.success,
    score: data.score,
    action: data.action,
    hostname: data.hostname,
    challenge_ts: data.challenge_ts,
  })

  return data.success && data.score > 0.6
}
