import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className='space-y-8 animate-pulse'>
      {/* Header Skeleton */}
      <div className='h-8 w-48 bg-muted rounded mb-2' />
      <div className='h-4 w-64 bg-muted rounded mb-4' />

      {/* Settings Sections Skeleton */}
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
              <div className='space-y-3'>
                {[1, 2, 3].map((j) => (
                  <div key={j} className='h-4 w-48 bg-muted rounded' />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
