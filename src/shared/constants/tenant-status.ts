export type TenantStatus = 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED' | 'BANKRUPT' | 'REORGANIZING'

export const TENANT_STATUS_LABELS: Record<TenantStatus, string> = {
  ACTIVE: 'Действующая',
  LIQUIDATING: 'Ликвидируется',
  LIQUIDATED: 'Ликвидирована',
  BANKRUPT: 'Банкротство',
  REORGANIZING: 'Реорганизация',
} as const
