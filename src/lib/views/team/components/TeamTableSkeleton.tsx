export const TeamTableSkeleton = () => {
  return (
    <Card className="w-full">
      <div className="flex w-full flex-col" suppressHydrationWarning>
        <div className="grid grid-cols-4 gap-4 border-b p-4 font-medium" suppressHydrationWarning>
          <div suppressHydrationWarning>Name</div>
          <div suppressHydrationWarning>Email</div>
          <div suppressHydrationWarning>Role</div>
          <div className="text-right" suppressHydrationWarning>Actions</div>
        </div>
        <div className="flex flex-col gap-4 p-4" suppressHydrationWarning>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4" suppressHydrationWarning>
              <Skeleton className="h-8 w-full">
                <div className="animate-pulse rounded-md bg-primary/10 h-8 w-full" suppressHydrationWarning />
              </Skeleton>
              <Skeleton className="h-8 w-full">
                <div className="animate-pulse rounded-md bg-primary/10 h-8 w-full" suppressHydrationWarning />
              </Skeleton>
              <Skeleton className="h-8 w-full">
                <div className="animate-pulse rounded-md bg-primary/10 h-8 w-full" suppressHydrationWarning />
              </Skeleton>
              <Skeleton className="h-8 w-full">
                <div className="animate-pulse rounded-md bg-primary/10 h-8 w-full" suppressHydrationWarning />
              </Skeleton>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
} 