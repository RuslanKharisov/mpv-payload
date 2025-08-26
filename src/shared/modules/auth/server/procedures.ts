import { RegisterSchema } from '@/entities/user'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { headers as getHeaders } from 'next/headers'
import { LoginSchema } from '@/entities/user/_domain/schemas'
import { GenerateAuthCookies } from '@/utilities/generateAuthCookies'

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

      await ctx.payload.create({
        collection: 'users',
        data: {
          email: input.email,
          password: input.password,
          username: input.username,
        },
      })
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
})
