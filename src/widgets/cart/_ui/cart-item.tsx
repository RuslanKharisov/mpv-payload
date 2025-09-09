import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { ExternalLink, Minus, Plus, Trash2 } from 'lucide-react'
import { Separator } from '@/shared/ui/separator'
import { CartEntry } from '@/entities/cart/_domain/normalized-cartItem'

interface CartItemProps {
  entry: CartEntry
  isLastItem: boolean
  onRemove: (stockId: string) => void
  onUpdateQuantity: (stockId: string, newQuantity: number) => void
}

export function CartItem({ entry, isLastItem, onRemove, onUpdateQuantity }: CartItemProps) {
  const { item, quantity } = entry

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <figure className="flex h-[87px] w-[87px] flex-shrink-0 items-center justify-center">
          <Image
            alt={item.id.toString()}
            src={item.imageUrl}
            width={80}
            height={80}
            className="h-full w-full object-contain"
          />
        </figure>

        <div className="flex w-full flex-col gap-4 text-muted-foreground">
          <div className="w-full max-w-[380px] self-start font-medium">
            <p className="text-md mb-2 font-semibold leading-6 text-foreground">
              <Link href="#" className="hover:text-primary group inline-flex items-center">
                {item.sku}
                <ExternalLink className="ml-1 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {item.manufacturer}
              </span>
            </p>
            <p className="inline-flex gap-1 text-xs leading-6">
              Склад: <span className="font-semibold text-foreground">{'!! Город'}</span>
            </p>
            <p className="text-xs leading-6">
              В наличие: <span className="text-foreground">{item.availableQuantity}</span> ед.
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
                  onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input className="w-16 text-center" value={quantity} readOnly />
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="+"
                  disabled={quantity >= item.availableQuantity}
                  onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="w-full mt-4 md:mt-0 text-base font-semibold text-foreground sm:ml-4">
              {item.currencyCode} {item.price?.toFixed(2)}
            </p>

            <div className="flex w-full justify-end md:w-fit">
              <Button
                title="Remove Product"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {!isLastItem && <Separator />}
    </div>
  )
}
