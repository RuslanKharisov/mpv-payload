import type { Payload } from 'payload'

export const seedUsers = async (payload: Payload) => {
  console.log('— Seeding demo user...')

  // Удаляем пользователя, если он уже существует, для чистоты
  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  const contentAuthor = await payload.create({
    collection: 'users',
    data: {
      username: 'Content Author',
      email: 'demo-author@example.com',
      password: 'editorPassword',
    },
  })

  console.log('✓ Demo user created successfully.')

  // Возвращаем созданного пользователя, чтобы использовать его в других сидерах
  return {
    contentAuthor,
  }
}
