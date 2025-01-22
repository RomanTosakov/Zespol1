export const TeamTable = () => {
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
          {/* Team members list */}
          {/* Add suppressHydrationWarning to any other divs that might be affected */}
        </div>
      </div>
    </Card>
  )
} 