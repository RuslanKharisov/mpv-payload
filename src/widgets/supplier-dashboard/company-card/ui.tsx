import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Building2, Globe, Mail, Edit3 } from 'lucide-react'
import { Typography } from '@/shared/ui/typography'
import { UpdateTenantDialog } from '@/features/update-tenant/_ui/update-tenant-dialog'
import { Button } from '@/shared/ui/button'
import { SupplierDashboardTenant } from '@/entities/dashboard/model/types'

export interface CompanyCardProps {
  tenant: SupplierDashboardTenant
}

export function CompanyCard({ tenant }: CompanyCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Компания</CardTitle>
        <div className="flex items-center gap-2">
          <UpdateTenantDialog tenant={tenant}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit3 className="h-4 w-4" />
            </Button>
          </UpdateTenantDialog>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <Typography tag="p" wrapper={false} className="text-lg font-bold">
          {tenant.name}
        </Typography>
        <div className="flex flex-col gap-y-1">
          {tenant.domain && (
            <Typography
              tag="p"
              wrapper={false}
              className="flex items-center gap-1 text-xs text-muted-foreground"
            >
              <Globe className="h-3 w-3" />
              {tenant.domain}
            </Typography>
          )}
          <Typography
            tag="p"
            wrapper={false}
            className="flex items-center gap-1 text-xs text-muted-foreground"
          >
            <Mail className="h-3 w-3" />
            {tenant.requestEmail}
          </Typography>
          <Typography tag="p" wrapper={false} className="text-xs text-muted-foreground">
            Дата регистрации: {new Date(tenant.createdAt).toLocaleDateString('ru-RU')}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}
