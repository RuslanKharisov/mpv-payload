import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { User } from 'lucide-react'
import type { User as UserType } from '@/payload-types'
import { Typography } from '@/shared/ui/typography'

export interface UserCardProps {
  user: UserType
}

export function UserCard({ user }: UserCardProps) {
  const tenantRoles = user.tenants?.[0]?.roles ?? []
  const systemRoles = user.roles ?? []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Пользователь</CardTitle>
        <User className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Typography tag="p" wrapper={false} className="text-lg font-bold">
          {user.username || user.email}
        </Typography>
        <Typography tag="p" wrapper={false} className="text-xs text-muted-foreground">
          {user.email}
        </Typography>
        <div className="mt-2 space-y-1">
          {systemRoles.length > 0 && (
            <Typography tag="p" wrapper={false} className="text-xs">
              <span className="text-muted-foreground">Системные роли:</span>{' '}
              {systemRoles.join(', ')}
            </Typography>
          )}
          {tenantRoles.length > 0 && (
            <Typography tag="p" wrapper={false} className="text-xs">
              <span className="text-muted-foreground">Роли в компании:</span>{' '}
              {tenantRoles.join(', ')}
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
