import { generateEmailHTML } from './generateEmailHTML'

import { sanitizeUserDataForEmail } from 'payload/shared'

type User = {
  email: string
  name?: string
}

type GenerateVerificationEmailArgs = {
  token: string
  user: User
}

export const generateVerificationEmail = async (
  args: GenerateVerificationEmailArgs,
): Promise<string> => {
  const { token, user } = args

  return generateEmailHTML({
    content: `<p>Привет${user.name ? ' ' + sanitizeUserDataForEmail(user.name) : ''}! Подтвердите свою учётную запись, нажав кнопку ниже.</p>`,
    cta: {
      buttonLabel: 'Verify',
      url: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/verify?token=${token}&email=${user.email}`,
    },
    headline: 'Verify your account',
  })
}
