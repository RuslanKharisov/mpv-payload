import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  console.log(`Revalidating redirects`)

  revalidateTag('redirects')

  return doc
}
