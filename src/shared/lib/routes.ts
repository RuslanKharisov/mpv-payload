const DASHBOARD = '/dashboard'

export const ROUTES = {
  HOME: '/',
  DASHBOARD: {
    ROOT: DASHBOARD,
    BILLING: `${DASHBOARD}/billing`,
    SETTINGS: `${DASHBOARD}/settings`,
    TENANTS: `${DASHBOARD}/tenants`,
    WAREHOUSES: `${DASHBOARD}/warehouses`,
    STOCKS: `${DASHBOARD}/stocks`,
  },
  SUPPLIERS: '/suppliers', // если где-то еще осталось
} as const

export type AppRoute = typeof ROUTES

export const getRouteDashBoard = () => ROUTES.DASHBOARD.ROOT
export const getRouteBilling = () => ROUTES.DASHBOARD.BILLING
