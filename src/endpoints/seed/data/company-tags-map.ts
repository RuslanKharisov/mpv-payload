import { companyTagsData } from './company-tags-data'

export const companyTagNameToSlug: Record<string, string> = Object.fromEntries(
  companyTagsData.map(({ name, slug }) => [name, slug]),
)
