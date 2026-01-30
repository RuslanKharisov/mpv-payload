import { cn } from '@/shared/utilities/ui'

export type TypographyVariant =
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
  'inter-bold-48': 'text-[48px] leading-[120%] font-[family-name:inter] font-bold',
  'inter-bold-36': 'text-[36px] leading-[120%] font-[family-name:inter] font-bold',
  'inter-md-24': 'text-[24px] leading-[120%] var(--font-inter) font-medium',
  'inter-md-16': 'text-[16px] leading-[20px] var(--font-inter) font-medium',
  'inter-reg-14': 'text-[14px] leading-[20px] var(--font-inter) font-normal',
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
