import { SupplierDashboardUser } from '@/entities/dashboard/model/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Typography } from '@/shared/ui/typography'
import { User } from 'lucide-react'

export interface UserCardProps {
  user: SupplierDashboardUser
}

export function UserCard({ user }: UserCardProps) {
  const systemRoles = user.roles ?? []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Пользователь</CardTitle>
        <User className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <Typography tag="p" wrapper={false} className="text-lg font-bold">
          {user.email}
        </Typography>
        <div className="flex flex-col gap-y-1">
          <Typography tag="p" wrapper={false} className="text-xs text-muted-foreground">
            {user.name}
          </Typography>
          <div className="space-y-1">
            {systemRoles.length > 0 && (
              <Typography tag="p" wrapper={false} className="text-xs">
                <Typography tag="span" wrapper={false} className="text-muted-foreground">
                  Системные роли:
                </Typography>{' '}
                {systemRoles.join(', ')}
              </Typography>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
