import type { Endpoint } from 'payload'
import { randomBytes } from 'node:crypto'
import { generateVerificationEmail } from '@/payload/email/generateVerificationEmail'

export const resendVerificationHandler: Endpoint = {
  handler: async (req) => {
    let data: { [key: string]: string } = {}

    try {
      if (typeof req.json === 'function') {
        data = await req.json()
      }
    } catch (error) {}
    const { email } = data

    if (!email) return Response.json({ error: 'email is required' })

    const { docs } = await req.payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })
    const foundUser = docs?.[0]

    if (!foundUser) return Response.json({ error: 'User not found' })
    if ((foundUser as any)._verified) return Response.json({ ok: true, alreadyVerified: true })

    const token = randomBytes(32).toString('hex')

    await req.payload.update({
      collection: 'users',
      id: foundUser.id,
      data: {
        _verificationToken: token,
      },
    })

    const html = await generateVerificationEmail({ token, user: foundUser })
    await req.payload.sendEmail({
      to: email,
      subject: 'Подтвердите вашу почту',
      html,
    })

    return Response.json({ ok: true })
  },
  method: 'post',
  path: '/external-users/login',
}
