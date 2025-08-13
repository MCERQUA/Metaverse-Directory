export function GridSkeleton() {
  return (
    <div className="space-y-12">
      {[1, 2, 3, 4].map((row) => (
        <section key={row}>
          <div className="h-8 bg-muted rounded w-48 mb-6 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden border border-border/50">
                <div className="aspect-video bg-muted animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
