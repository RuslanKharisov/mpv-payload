import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: _req }) => {
  console.log(`Revalidating redirects`)

  revalidateTag('redirects')

  return doc
}
