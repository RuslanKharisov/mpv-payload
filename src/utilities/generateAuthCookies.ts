import { cookies as getCookies } from 'next/headers'

interface props {
  prefix: string
  value: string
}

/* Генерация куки для авторизации пользователя */
export const GenerateAuthCookies = async ({ prefix, value }: props) => {
  const cookies = await getCookies()
  cookies.set({
    name: `${prefix}-token `,
    value: value,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
}
