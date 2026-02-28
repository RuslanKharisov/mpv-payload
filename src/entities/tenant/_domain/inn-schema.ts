import { z } from 'zod'

export const InnSchema = z.string().regex(/^\d{10,12}$/, 'ИНН должен содержать 10 или 12 цифр')
