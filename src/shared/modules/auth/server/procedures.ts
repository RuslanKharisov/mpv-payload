import { RegisterSchema } from '@/entities/user'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { headers as getHeaders, cookies as getCookies } from 'next/headers'
import z from 'zod'

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()

    const session = await ctx.payload.auth({ headers })

    return session
  }),

  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies()
    cookies.delete('AUTH_COOKIE')
  }),

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

      const cookies = await getCookies()
      cookies.set({
        name: 'AUTH_COOKIE',
        value: data.token,
        httpOnly: true,
        path: '/',
        // TODO: set secure to true in production
        secure: process.env.NODE_ENV === 'production',
        // TODO: Ensure cross-domain cookies are set correctly in production
      })
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
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

      const cookies = await getCookies()
      cookies.set({
        name: 'AUTH_COOKIE',
        value: data.token,
        httpOnly: true,
        path: '/',
        // TODO: set secure to true in production
        secure: process.env.NODE_ENV === 'production',
        // TODO: Ensure cross-domain cookies are set correctly in production
        // sameSite: 'none',
        // domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
      })

      return data
    }),
})
