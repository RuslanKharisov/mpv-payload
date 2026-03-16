'use client'
import { ProfileAvatar } from '@/entities/user/_ui/profile-avatar'
import { LogoutButton } from '@/features/auth/_ui/logout-button'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { UserIcon } from 'lucide-react'
import Link from 'next/link'
import { LoginButton } from './login-button'
import { Profile } from '@/entities/profile/_domain/profile'

interface UserProfileProps {
  user: Profile
}

export function UserProfile({ user }: UserProfileProps) {
  if (!user.id) {
    return <LoginButton />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 self-center rounded-full p-px">
          <ProfileAvatar profile={user} className="h-8 w-8 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 w-56 ">
        <DropdownMenuLabel>
          <p>Мой аккаунт</p>
          <p className="overflow-hidden text-ellipsis text-xs text-muted-foreground">
            {user.username && user.username}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuGroup></DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/suppliers`}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Личный кабинет</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LogoutButton className="w-full" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
