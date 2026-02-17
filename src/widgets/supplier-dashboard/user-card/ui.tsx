import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { User } from 'lucide-react'
import type { User as UserType } from '@/payload-types'

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
        <User className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold">{user.username || user.email}</div>
        <div className="text-xs text-muted-foreground">{user.email}</div>
        <div className="mt-2 space-y-1">
          {systemRoles.length > 0 && (
            <div className="text-xs">
              <span className="text-muted-foreground">Системные роли:</span>{' '}
              {systemRoles.join(', ')}
            </div>
          )}
          {tenantRoles.length > 0 && (
            <div className="text-xs">
              <span className="text-muted-foreground">Роли в компании:</span>{' '}
              {tenantRoles.join(', ')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
