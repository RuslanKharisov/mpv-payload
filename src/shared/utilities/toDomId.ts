import slugify from 'slugify'

export const toDomId = (string: string) =>
  slugify(string, {
    lower: true,
    strict: true,
    locale: 'ru',
  })
