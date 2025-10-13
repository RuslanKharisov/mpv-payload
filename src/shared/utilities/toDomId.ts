import slugify from 'slugify'

export const toDomId = (string: string) => {
  const id = slugify(string, {
    lower: true,
    strict: true,
    locale: 'ru',
  })

  if (!id || /^[0-9-]/.test(id)) {
    return 'id-' + (id || Math.random().toString(36).substring(2, 9))
  }

  return id
}
