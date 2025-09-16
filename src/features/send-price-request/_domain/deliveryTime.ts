export const deliveryTimeLabels = {
  ANY: 'Любой',
  NEXT_DAY: 'На следующий день',
  TWO_TREE_DAYS: '2-3 дня',
  FOUR_SIX_DAYS: '4-6 дней',
  TEN_PLUS_DAYS: '10+ дней',
  SEVEN_TEN_DAYS: '7-10 дней',
  EMERGENCY: 'Срочно',
} as const

export type DeliveryTime = keyof typeof deliveryTimeLabels

export function formatDeliveryTime(value: DeliveryTime | string): string {
  return deliveryTimeLabels[value as DeliveryTime] ?? value
}
