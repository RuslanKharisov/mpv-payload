export const toDomId = (string: string) =>
  string
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zа-я0-9-_]/gi, '')
