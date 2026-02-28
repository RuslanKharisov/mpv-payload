export interface DaDataCompanySuggestion {
  value: string
  data: {
    inn: string
    name: {
      short_with_opf: string
      full_with_opf?: string
    }
    state?: {
      status?: 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED' | 'BANKRUPT' | 'REORGANIZING' | string // на всякий случай, если DaData добавит новое
      actuality_date?: string | number | null
      registration_date?: string | number | null
      liquidation_date?: string | number | null
    }
  }
}

export type DaDataCompanyResponse = {
  suggestions: DaDataCompanySuggestion[]
}
