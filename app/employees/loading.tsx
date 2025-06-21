import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className='space-y-8 animate-pulse'>
      {/* Header Skeleton */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <div className='h-8 w-48 bg-muted rounded mb-2' />
          <div className='h-4 w-64 bg-muted rounded' />
        </div>
        <div className='flex gap-2 flex-wrap'>
          <div className='h-10 w-36 bg-muted rounded' />
          <div className='h-10 w-36 bg-muted rounded' />
        </div>
      </div>

      {/* Search/Filter Bar Skeleton */}
      <div className='h-10 w-full max-w-xl bg-muted rounded mb-4' />

      {/* Employee Cards/List Skeleton */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            className='bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background'
          >
            <CardHeader className='flex flex-row items-center gap-4 pb-2'>
              <div className='h-12 w-12 bg-muted rounded-full' />
              <div className='flex-1 space-y-2'>
                <CardTitle className='h-4 w-32 bg-muted rounded' />
                <div className='h-3 w-24 bg-muted rounded' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='h-3 w-20 bg-muted rounded mb-2' />
              <div className='h-3 w-28 bg-muted rounded' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
