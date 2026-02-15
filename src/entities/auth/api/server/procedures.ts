import { RegisterSchema } from '@/entities/user'
import { LoginSchema } from '@/entities/user/_domain/schemas'
import { baseProcedurePublic, createTRPCRouter } from '@/shared/trpc/init'
import { GenerateAuthCookies } from '@/shared/utilities/generateAuthCookies'
import { isValidName } from '@/shared/utilities/isValidName'
import { verifyRecaptcha } from '@/shared/utilities/verifyRecaptcha'
import { TRPCError } from '@trpc/server'
import { headers as getHeaders } from 'next/headers'
import z from 'zod'

export const authRouter = createTRPCRouter({
  session: baseProcedurePublic.query(async ({ ctx }) => {
    const headers = await getHeaders()

    const session = await ctx.payload.auth({ headers })

    return session
  }),

  /**  Метод регистрации нового пользователя  */
  register: baseProcedurePublic
    .input(RegisterSchema)

    .mutation(async ({ input, ctx }) => {
      if (input.website?.trim()) {
        const headers = await getHeaders()

        const ip =
          headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          headers.get('x-real-ip') ||
          headers.get('remote-addr') ||
          'unknown'

        console.warn('HONEYPOT TRIGGERED — possible bot registration attempt', {
          email: input.email,
          username: input.username,
          website: input.website,
          ip,
        })
        // ложное сообщение для бота
        return { message: 'Пользователь успешно создан. Пожалуйста, подтвердите почту.' }
      }

      const isValidCaptcha = await verifyRecaptcha(input.recaptchaToken)
      if (!isValidCaptcha) {
        const headers = await getHeaders()
        const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
        console.warn('reCAPTCHA verification failed', {
          email: input.email,
          ip,
          timeStamp: new Date().toISOString(),
        })
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Не удалось пройти проверку reCAPTCHA. Пожалуйста, попробуйте еще раз.',
        })
      }

      if (!isValidName(input.username)) {
        const headers = await getHeaders()
        const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

        console.warn('Invalid username detected', {
          username: input.username,
          email: input.email,
          ip,
        })

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Не валидное имя пользователя ...',
        })
      }

      const existingData = await ctx.payload.find({
        collection: 'users',
        limit: 1,
        where: { username: { equals: input.username } },
      })

      const existingUser = existingData?.docs?.[0]

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Пользователь с таким именем уже существует',
        })
      }

      // 1. Создаем тенант
      const tenant = await ctx.payload.create({
        collection: 'tenants',
        data: {
          name: input.username,
          requestEmail: input.email,
        },
      })

      try {
        // 2. Попытка создать пользователя
        console.log('create ==> ')
        const newUser = await ctx.payload.create({
          collection: 'users',
          data: {
            email: input.email,
            password: input.password,
            username: input.username,
            tenants: [{ tenant: tenant.id, roles: ['tenant-viewer'] }],
          },
        })

        return { message: 'Пользователь успешно создан. Пожалуйста, подтвердите почту.' }
      } catch (error) {
        console.log('error ==> ', error)
        // 3. Если создание пользователя не удалось, удаляем тенант
        await ctx.payload.delete({ collection: 'tenants', id: tenant.id })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Не удалось создать пользователя. Пожалуйста, попробуйте еще раз.',
          cause: error,
        })
      }
    }),

  /**  Метод входа пользователя  */
  login: baseProcedurePublic.input(LoginSchema).mutation(async ({ input, ctx }) => {
    const data = await ctx.payload.login({
      collection: 'users',
      data: {
        email: input.email,
        password: input.password,
      },
    })

    if (!data.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Could not log in with those credentials.',
      })
    }

    await GenerateAuthCookies({
      prefix: ctx.payload.config.cookiePrefix,
      value: data.token,
    })

    return data
  }),

  /** Метод для проверки почты */
  verifyEmail: baseProcedurePublic
    .input(
      z.object({
        token: z.string(),
        email: z.email(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.payload.verifyEmail({
        collection: 'users',
        token: input.token,
      })
      return result
    }),
})
