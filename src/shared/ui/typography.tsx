import { cn } from '@/shared/utilities/ui'

export type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div' | 'p'

// Inline/phrasing elements that shouldn't be wrapped in a div
const inlineTags = new Set(['span', 'a', 'strong', 'em', 'small', 'label', 'b', 'i'])

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  tag?: TypographyTag
  className?: string
  children: React.ReactNode
  /**
   * Force wrapper div. When undefined, auto-detected based on tag type.
   * - true: always wrap in div
   * - false: never wrap in div
   * - undefined: wrap only for block-level tags
   */
  wrapper?: boolean
}

export const Typography = ({
  tag: Tag = 'div',
  className,
  children,
  wrapper,
  ...props
}: TypographyProps) => {
  const proseClasses = cn(
    'payload-richtext',
    'max-w-none prose md:prose-md lg:prose-lg dark:prose-invert',
    className,
  )

  // Auto-detect: use wrapper for block-level elements, skip for inline
  const needsWrapper = wrapper ?? !inlineTags.has(Tag)

  if (!needsWrapper) {
    return (
      <Tag {...props} className={className}>
        {children}
      </Tag>
    )
  }

  return (
    <div className={proseClasses}>
      <Tag {...props}>{children}</Tag>
    </div>
  )
}
