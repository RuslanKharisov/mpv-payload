import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Building2, Globe, Mail } from 'lucide-react'
import type { Tenant } from '@/payload-types'

export interface CompanyCardProps {
  tenant: Tenant
}

export function CompanyCard({ tenant }: CompanyCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Компания</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold">{tenant.name}</div>
        {tenant.domain && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Globe className="h-3 w-3" />
            {tenant.domain}
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Mail className="h-3 w-3" />
          {tenant.requestEmail}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Дата регистрации: {new Date(tenant.createdAt).toLocaleDateString('ru-RU')}
        </div>
      </CardContent>
    </Card>
  )
}
