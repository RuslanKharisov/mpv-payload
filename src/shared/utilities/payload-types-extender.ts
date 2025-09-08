/**
 * WithPopulatedRelation
 *
 * Заменяет в типе `T` поле `K` на "id | объект".
 *
 * Используется, когда мы НЕ уверены, придёт ли в ответе PayloadCMS
 * только id (`string | number`) или уже "популянный" объект `R`.
 *
 * Пример:
 *   type StockWithMaybeTenant = WithPopulatedRelation<Stock, 'tenant', Tenant>
 *   // tenant: number | Tenant
 */
export type WithPopulatedRelation<T, K extends keyof T, R> = Omit<T, K> & { [P in K]: T[P] | R }

/**
 * WithPopulated
 *
 * Заменяет в типе `T` поле `K` на "объект".
 *
 * Используется, когда мы точно знаем, что данные приходят с `depth >= 1`
 * и поле гарантированно популянное объектом `R`.
 *
 * Пример:
 *   type StockWithTenant = WithPopulated<Stock, 'tenant', Tenant>
 *   // tenant: Tenant
 */
export type WithPopulated<T, K extends keyof T, R> = Omit<T, K> & { [P in K]: R }
