import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { User } from 'lucide-react'
import type { SupplierDashboardUser } from '@/entities/dashboard/api/get-supplier-dashboard-summary'
import { Typography } from '@/shared/ui/typography'

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
                <span className="text-muted-foreground">Системные роли:</span>{' '}
                {systemRoles.join(', ')}
              </Typography>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
