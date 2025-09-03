import { readFile } from 'fs/promises'
import path from 'path'

export const fetchFileFromDisk = async (filename: string) => {
  const filePath = path.join(process.cwd(), 'src/endpoints/seed/images', filename)
  return await readFile(filePath)
}
