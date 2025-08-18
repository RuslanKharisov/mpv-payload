import { cn } from '@/utilities/ui'

export type TypographyVariant =
  | 'visuelt-bold-48'
  | 'visuelt-bold-32'
  | 'poppins-md-24'
  | 'poppins-md-16'
  | 'poppins-reg-14'

export type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div' | 'p' | 'li'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  tag?: TypographyTag
  variant: TypographyVariant
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<TypographyVariant, string> = {
  'visuelt-bold-48': 'text-[48px] leading-[120%] font-[family-name:Visuelt] font-bold',
  'visuelt-bold-32': 'text-[32px] leading-[120%] font-[family-name:Visuelt] font-bold',
  'poppins-md-24': 'text-[24px] leading-[120%] var(--font-poppins) font-medium',
  'poppins-md-16': 'text-[16px] leading-[20px] var(--font-poppins) font-medium',
  'poppins-reg-14': 'text-[14px] leading-[20px] var(--font-poppins) font-normal',
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
