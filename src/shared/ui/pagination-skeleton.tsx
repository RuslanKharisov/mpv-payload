import { Skeleton } from '@/shared/ui/skeleton'

function PaginationSkeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className="flex justify-between w-full">
      <Skeleton className="h-8 w-24" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  )
}

export { PaginationSkeleton }
