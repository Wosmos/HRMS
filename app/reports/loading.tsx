import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className='space-y-8 animate-pulse'>
      {/* Header Skeleton */}
      <div className='h-8 w-48 bg-muted rounded mb-2' />
      <div className='h-4 w-64 bg-muted rounded mb-4' />

      {/* Filter/Search Bar Skeleton */}
      <div className='h-10 w-full max-w-xl bg-muted rounded mb-4' />

      {/* Stat Cards Skeleton */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8'>
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className='bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background'
          >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='h-4 w-24 bg-muted rounded' />
              <div className='h-5 w-5 bg-muted rounded-full' />
            </CardHeader>
            <CardContent>
              <div className='h-8 w-20 bg-muted rounded mb-2' />
              <div className='h-3 w-28 bg-muted rounded' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className='bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background'
          >
            <CardHeader>
              <CardTitle className='h-4 w-32 bg-muted rounded mb-2' />
              <div className='h-3 w-40 bg-muted rounded' />
            </CardHeader>
            <CardContent>
              <div className='h-40 w-full bg-muted rounded' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
