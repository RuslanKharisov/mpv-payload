import { cn } from '@/shared/ui/utils'
import { FC } from 'react'

export interface SocialsData {
  icon: FC<{ size?: string; color?: string }> // Type for the icon as a functional component
  link: string
  label: string
}

interface SocialsProps {
  socialsData: SocialsData[]
  size?: string
  className?: string
}

const Socials: FC<SocialsProps> = ({ size, socialsData, className }) => {
  return (
    <div className={cn('flex gap-3', className)}>
      {socialsData.map(({ icon: Icon, link, label }, index) => (
        <a
          key={index}
          href={link}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent hover:text-accent-foreground"
          aria-label={label}
          target="_blank"
        >
          <Icon size={size} color="currentColor" />
        </a>
      ))}
    </div>
  )
}

export { Socials }
