'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/features/cart/CartProvider'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { ArrowRight, ExternalLink, Minus, Plus, Trash2 } from 'lucide-react'
import { Stock } from '@/payload-types'
import { Separator } from '@/shared/ui/separator'
import { StockWithTenantAndCurrency } from '@/features/stock'

// Определяем тип для сгруппированных элементов
type GroupedItems = {
  [key: string]: Array<{
    stock: StockWithTenantAndCurrency
    quantity: number
  }>
}

export default function CartPage() {
  const { items, removeFromCart, clearCart, updateQuantity } = useCart()
  console.log('items ==> ', items)

  // Группируем товары по поставщику (tenant)
  const groupedItems = items.reduce((acc: GroupedItems, item) => {
    const tenantName = item.stock.tenant.name || 'Unknown Supplier'
    if (!acc[tenantName]) {
      acc[tenantName] = []
    }
    acc[tenantName].push(item)
    return acc
  }, {})

  // Вычисляем общую сумму по поставщику
  const calculateSupplierTotal = (supplierItems: any[]) => {
    return supplierItems
      .reduce((total, item) => total + item.stock.price * item.quantity, 0)
      .toFixed(2)
  }

  if (items.length === 0) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Ваша корзина</h1>
        <p className="text-muted-foreground">В корзине пока пусто.</p>
      </div>
    )
  }

  return (
    <div className="relative mt-[30px] flex p-6 md:mt-[90px]">
      <div className="container mx-auto max-w-screen-xl">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded p-6 shadow-sm md:flex-row bg-card border">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Your cart</h2>
          </div>
          <Button
            variant="ghost"
            onClick={clearCart}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Clear cart
          </Button>
        </div>

        {Object.entries(groupedItems).map(([tenantName, supplierItems]) => (
          <div key={tenantName} className="mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Левая часть: Список товаров поставщика */}
              <div className="lg:w-2/3">
                <Card>
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold sm:text-base">{tenantName}</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {supplierItems.map(({ stock, quantity }, index) => (
                      <div key={stock.id}>
                        <div className="flex flex-col sm:flex-row gap-4 p-4">
                          <figure className="flex h-[87px] w-[87px] flex-shrink-0 items-center justify-center">
                            <Image
                              alt={stock.id.toString()}
                              src={
                                stock.product.productImage.thumbnailURL ||
                                'https://placehold.co/100'
                              }
                              width={80}
                              height={80}
                              className="h-full w-full object-contain"
                            />
                          </figure>
                          <div className="flex w-full flex-col gap-4 text-muted-foreground">
                            <div className="w-full max-w-[380px] self-start font-medium">
                              <p className="text-md mb-2 font-semibold leading-6 text-foreground">
                                <Link
                                  href="#"
                                  className="hover:text-primary group inline-flex items-center"
                                >
                                  {stock.product.sku}
                                  <ExternalLink className="ml-1 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                                </Link>
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                  {stock.product.manufacturer?.name}
                                </span>
                              </p>
                              <p className="inline-flex gap-1 text-xs leading-6">
                                Склад:
                                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                                  {'!! Подключить город'}
                                </span>
                              </p>
                              <p className="text-xs leading-6">
                                В наличие: <span className="text-foreground">{stock.quantity}</span>{' '}
                                ед.
                              </p>
                            </div>
                            <div className="flex w-full flex-col md:flex-row items-start md:items-center">
                              <div className="w-full max-w-[180px]">
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    aria-label="-"
                                    disabled={quantity <= 1}
                                    onClick={() => updateQuantity(stock.id, quantity - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <Input className="w-16 text-center" value={quantity} readOnly />
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    aria-label="+"
                                    onClick={() => updateQuantity(stock.id, quantity + 1)}
                                    disabled={quantity >= stock.quantity}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                                <span className="mt-2 block text-xs text-muted-foreground">
                                  Max {stock.quantity} parts available
                                </span>
                              </div>
                              <div className="w-full mt-4 md:mt-0">
                                <p className="text-base font-semibold text-foreground sm:ml-4">
                                  {stock.currency.code}
                                  {stock.price?.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex w-full justify-end md:w-fit">
                                <Button
                                  title="Remove Product"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromCart(stock.id)}
                                >
                                  <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < supplierItems.length - 1 && <Separator />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Правая часть: Сводка по поставщику */}
              <div className="w-full self-start lg:w-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Итог</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground text-nowrap text-base">
                        Стоимость товаров (без НДС):
                      </p>
                      <p className="font-semibold text-foreground">
                        {supplierItems[0].stock.currency.code}
                        {calculateSupplierTotal(supplierItems)}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Запросить предложение
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
            <Separator className="my-8" />
          </div>
        ))}
      </div>
    </div>
  )
}
