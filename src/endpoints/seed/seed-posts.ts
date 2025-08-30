// src/endpoints/seed/seed-posts.ts
import type { Payload, PayloadRequest } from 'payload'
import { googleSheetsApiPost } from './data/google-sheets-api-post'
import { Media, User } from '@/payload-types'

// Определяем, какие зависимости нужны этому модулю
type SeedPostsDeps = {
  media: { [key: string]: Media }
  users: { [key: string]: User }
}

export const seedPosts = async (payload: Payload, req: PayloadRequest, deps: SeedPostsDeps) => {
  console.log('Delete posts...')
  await payload.db.deleteMany({
    collection: 'posts',
    req,
    where: {},
  })

  // Получаем зависимости
  const { media, users } = deps
  const { imageHomeDoc } = media // Используем одно из существующих медиа как hero-image
  const { contentAuthor } = users

  // 1. Создаем пост про Google Таблицы
  const post1Data = googleSheetsApiPost({
    heroImage: imageHomeDoc,
    author: contentAuthor,
  })

  console.log('Create posts...')
  await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post1Data,
  })

  console.log('✓ Posts seeded successfully.')
}
