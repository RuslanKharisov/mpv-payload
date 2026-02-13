import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { GoogleSheetsConfig } from '@/widgets/warehouses/google-config'
// import { LocalWarehouses } from '@/widgets/warehouses/local-warehouses'

export default async function WarehousesPage() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 md:py-6">
      <h1 className="text-2xl font-bold tracking-tight">Управление складами</h1>

      <Tabs defaultValue="local" className="w-full">
        <TabsList>
          <TabsTrigger value="local">Локальные склады (БД)</TabsTrigger>
          <TabsTrigger value="google">Google Таблицы (API)</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="pt-4">
          Локальные склады (БД)
          {/* Здесь будет список сущностей Warehouse и остатков Stock */}
          {/* <LocalWarehouses /> */}
        </TabsContent>

        <TabsContent value="google" className="pt-4">
          Google Таблицы (API)
          <GoogleSheetsConfig />
        </TabsContent>
      </Tabs>
    </div>
  )
}
