import z from 'zod'

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(100, 'Username must be at most 100 characters long')
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      'Username can only contain letters, numbers and hyphens, and cannot begin or end with a hyphen.',
    )
    .refine((val) => !val.includes('--'), 'Username cannot contain consecutive hyphens.')
    .transform((val) => val.toLowerCase()),
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
