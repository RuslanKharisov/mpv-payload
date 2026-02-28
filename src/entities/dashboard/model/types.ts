// Безопасный интерфейс пользователя (без чувствительных полей)
export interface SupplierDashboardUser {
  id: string
  name: string
  email: string
  roles?: ('user' | 'admin' | 'super-admin' | 'content-editor')[]
}

// Безопасный интерфейс тенанта (без чувствительных полей)
export interface SupplierDashboardTenant {
  id: string
  name: string
  slug?: string | null
  domain?: string | null
  requestEmail: string
  createdAt: string
}

export interface SupplierDashboardSummary {
  user: SupplierDashboardUser
  tenant: SupplierDashboardTenant
  warehousesCount: number
  stocksCount: number
  skuCount: number
  warehousesWithStock: number
  warehousesSample: {
    id: string
    title: string
    address?: string
  }[]
  subscription?: {
    id: string
    status: 'active' | 'inactive' | 'canceled' | 'expired' | string
    endDate?: string
    tariffName?: string
    features?: string[]
  } | null
  canManageStock: boolean
  hasStockError?: boolean
  needsCompanyCompletion: boolean
}
