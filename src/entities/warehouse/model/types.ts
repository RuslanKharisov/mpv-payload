/**
 * UI-facing Warehouse type
 * Used for displaying warehouses in tables and forms
 * Excludes server-only fields like tenant, capacity, selectedAddressData
 */
export interface UiWarehouse {
  id: string
  title: string
  address?: string
  capacity?: number | null
  isDefault?: boolean
}

/**
 * Input DTO for creating a warehouse from the client
 * Only includes fields that user can provide
 */
export interface CreateWarehouseInput {
  title: string
  addressText: string
  addressData: unknown
}

/**
 * Result of warehouse creation operation
 */
export interface CreateWarehouseResult {
  success: boolean
  error?: string
  warehouse?: { id: string }
}
