import { Button } from '@/shared/ui/button'
import { Trash2 } from 'lucide-react'

interface CartHeaderProps {
  onClear: () => void
}

export function CartHeader({ onClear }: CartHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 rounded p-6 shadow-sm md:flex-row bg-card border">
      <h2 className="text-2xl font-bold">Ваша корзина</h2>
      <Button
        variant="ghost"
        onClick={onClear}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="mr-2 h-5 w-5" />
        Очистить
      </Button>
    </div>
  )
}
