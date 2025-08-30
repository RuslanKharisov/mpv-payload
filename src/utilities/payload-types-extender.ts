export type WithPopulatedRelation<T, K extends keyof T, R> = Omit<T, K> & { [P in K]: T[P] | R }
