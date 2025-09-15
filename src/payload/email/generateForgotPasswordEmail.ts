import type { PayloadRequest } from 'payload'

import { generateEmailHTML } from './generateEmailHTML'

type ForgotPasswordEmailArgs =
  | {
      req?: PayloadRequest
      token?: string
      user?: any
    }
  | undefined

export const generateForgotPasswordEmail = async (
  args: ForgotPasswordEmailArgs,
): Promise<string> => {
  return generateEmailHTML({
    content: '<p>Давайте поможем вам войти снова.</p>',
    cta: {
      buttonLabel: 'Подтвердить',
      url: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/reset/${args?.token}`,
    },
    headline: 'Забыли пароль?',
  })
}
