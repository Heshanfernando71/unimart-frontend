import { Card, CardContent, Skeleton } from '@mui/material'

export const ListingGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading listings">
    {Array.from({ length: 6 }, (_, index) => (
      <Card key={index}>
        <CardContent>
          <Skeleton width="35%" />
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="rounded" height={36} className="mt-5" />
        </CardContent>
      </Card>
    ))}
  </div>
)
