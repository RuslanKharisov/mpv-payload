import { RegisterSchema } from '@/entities/user'
import { baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { TRPCError } from '@trpc/server'
import { headers as getHeaders } from 'next/headers'
import { LoginSchema } from '@/entities/user/_domain/schemas'
import { GenerateAuthCookies } from '@/shared/utilities/generateAuthCookies'
import z from 'zod'

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()

    const session = await ctx.payload.auth({ headers })

    return session
  }),

  /**  Метод регистрации нового пользователя  */
  register: baseProcedure
    .input(RegisterSchema)

    .mutation(async ({ input, ctx }) => {
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
  login: baseProcedure.input(LoginSchema).mutation(async ({ input, ctx }) => {
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
  verifyEmail: baseProcedure
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
