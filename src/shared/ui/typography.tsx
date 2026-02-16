import { cn } from '@/shared/utilities/ui'

export type TypographyVariant =
  | 'display-48'
  | 'heading-36'
  | 'inter-bold-48'
  | 'inter-bold-36'
  | 'inter-md-24'
  | 'inter-md-16'
  | 'inter-reg-14'

export type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div' | 'p' | 'li'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  tag?: TypographyTag
  variant: TypographyVariant
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<TypographyVariant, string> = {
  'display-48': 'font-serif font-bold text-[48px] leading-tight',
  'heading-36': 'font-serif font-bold text-[36px] leading-snug',
  'inter-md-24': 'font-sans font-medium text-[24px]',
  'inter-reg-14': 'font-sans font-normal text-[14px]',

  'inter-bold-48': 'font-sans text-[48px] leading-[120%] font-bold',
  'inter-bold-36': 'font-sans text-[36px] leading-[120%] font-bold',
  'inter-md-16': 'font-sans text-[16px] leading-[20px] font-medium',
}

export const Typography = ({
  tag: Tag = 'div',
  variant,
  className,
  children,
  ...props
}: TypographyProps) => {
  return (
    <Tag className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Tag>
  )
}
