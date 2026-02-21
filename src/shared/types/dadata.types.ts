export interface DaDataSuggestion {
  value: string
  unrestricted_value: string
  data: {
    postal_code: string | null
    country: string
    region: string
    region_type_full: string
    city: string
    city_type_full: string
    street: string
    street_type_full: string
    house: string
    flat: string
    flat_area: number | null
    square_meter_price: number | null
    block: string
    block_type: string
    entrance: string
    floor: string
    tax_office: string
    tax_office_legal: string
    fias_id: string
    fias_code: string
    fias_level: string
    fias_actuality_state: number
    kladr_id: string
    geoname_id: string
    capital_marker: number
    okato: string
    oktmo: string
    tax_office_short: string
    tax_office_legal_short: string
    timezone: string
    geo_lat: string
    geo_lon: string
    beltway_hit: string
    beltway_distance: number | null
    metro: DaDataMetro[] | null
    divisions: string[] | null
    qc_geo: number | null
    qc_complete: number | null
    qc_house: number | null
    history_values: string[] | null
    unparsed_parts: string | null
    source: string | null
    qc: number | null
  }
}

export interface DaDataMetro {
  name: string
  line: string
  distance: number
}

export interface DaDataResponse {
  suggestions: DaDataSuggestion[]
}
