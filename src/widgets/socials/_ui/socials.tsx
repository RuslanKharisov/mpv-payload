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
    // <div className={cn('flex gap-3', className)}>
    <div className={cn('grid grid-cols-1 max-w-fit min-w-fit', className)}>
      <div className="relative z-0 inline-grid grid-cols-3 gap-1 rounded-full bg-white/10 p-0.5 text-white">
        {socialsData.map(({ icon: Icon, link, label }, index) => (
          <a
            key={index}
            href={link}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-slate-500 hover:text-accent-foreground duration-300"
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon size={size} />
          </a>
        ))}
      </div>
    </div>
  )
}

export { Socials }
