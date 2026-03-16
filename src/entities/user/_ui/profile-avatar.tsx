'use client'
import { Profile } from '@/entities/profile/_domain/profile'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { cn } from '@/shared/ui/utils'
import { UserIcon } from 'lucide-react'

export const ProfileAvatar = ({
  profile,
  className,
}: {
  profile?: Profile
  className?: string
}) => {
  if (!profile) {
    return null
  }

  return (
    <Avatar className={cn(className)}>
      <AvatarFallback>
        <UserIcon />
      </AvatarFallback>
    </Avatar>
  )
}
