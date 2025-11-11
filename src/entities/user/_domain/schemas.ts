import z from 'zod'

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  username: z
    .string()
    .min(3, 'Имя пользователя должно быть не короче 3 символов')
    .max(100, 'Имя пользователя должно быть не длиннее 100 символов')
    .regex(
      /^[A-Za-z0-9](?:[A-Za-z0-9_-]*[A-Za-z0-9])?$/,
      'Имя пользователя может содержать только латиницу, цифры, дефис и подчёркивание, и не может начинаться или заканчиваться на спецсимвол.',
    )
    .refine((val) => !val.includes('--') && !val.includes('__'), {
      message: 'Имя пользователя не может содержать подряд дефисы или подчёркивания.',
    }),
  website: z.string().optional(),
  recaptchaToken: z.string().min(0, 'reCAPTCHA обязательна'),
})

export const LoginSchema = z.object({
  email: z.email({
    message: 'Укажите почту',
  }),
  password: z.string().min(1, {
    message: 'Введите пароль',
  }),
  code: z.optional(z.string()),
})
