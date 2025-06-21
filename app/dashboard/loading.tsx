import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className='space-y-8 animate-pulse'>
      {/* Header and Quick Actions Skeleton */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <div className='h-8 w-48 bg-muted rounded mb-2' />
          <div className='h-4 w-64 bg-muted rounded' />
        </div>
        <div className='flex gap-2 flex-wrap'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-10 w-36 bg-muted rounded' />
          ))}
        </div>
      </div>

      {/* Stat Cards Skeleton */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
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

      {/* Infographics Row Skeleton */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4 bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background'>
          <CardHeader>
            <CardTitle className='h-4 w-32 bg-muted rounded mb-2' />
            <div className='h-3 w-40 bg-muted rounded' />
          </CardHeader>
          <CardContent>
            <div className='h-40 w-full bg-muted rounded' />
          </CardContent>
        </Card>
        <Card className='col-span-3 bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background'>
          <CardHeader>
            <CardTitle className='h-4 w-32 bg-muted rounded mb-2' />
            <div className='h-3 w-40 bg-muted rounded' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='flex items-center gap-4'>
                  <div className='h-10 w-10 bg-muted rounded-full' />
                  <div className='flex-1 space-y-1'>
                    <div className='h-4 w-24 bg-muted rounded' />
                    <div className='h-3 w-20 bg-muted rounded' />
                  </div>
                  <div className='h-4 w-4 bg-muted rounded-full' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Distribution & Leaves Taken Skeleton */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='col-span-2 bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background'>
          <CardHeader>
            <CardTitle className='h-4 w-32 bg-muted rounded mb-2' />
            <div className='h-3 w-40 bg-muted rounded' />
          </CardHeader>
          <CardContent>
            <div className='h-40 w-full bg-muted rounded' />
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background'>
          <CardHeader>
            <CardTitle className='h-4 w-32 bg-muted rounded mb-2' />
            <div className='h-3 w-40 bg-muted rounded' />
          </CardHeader>
          <CardContent>
            <div className='h-40 w-full bg-muted rounded' />
          </CardContent>
        </Card>
      </div>

      {/* Top Performers & Recent Activities Skeleton */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {[1, 2].map((i) => (
          <Card
            key={i}
            className='bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background'
          >
            <CardHeader>
              <CardTitle className='h-4 w-32 bg-muted rounded mb-2' />
              <div className='h-3 w-40 bg-muted rounded' />
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {[1, 2, 3].map((j) => (
                  <div key={j} className='flex items-center gap-3'>
                    <div className='h-8 w-8 bg-muted rounded-full' />
                    <div className='flex-1'>
                      <div className='h-4 w-24 bg-muted rounded mb-1' />
                      <div className='h-3 w-16 bg-muted rounded' />
                    </div>
                    <div className='h-4 w-8 bg-muted rounded' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
