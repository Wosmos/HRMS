import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className='space-y-8 animate-pulse'>
      {/* Header Skeleton */}
      <div className='h-8 w-48 bg-muted rounded mb-2' />
      <div className='h-4 w-64 bg-muted rounded mb-4' />

      {/* Filter/Search Bar Skeleton */}
      <div className='h-10 w-full max-w-xl bg-muted rounded mb-4' />

      {/* Payroll Table/List Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle className='h-4 w-32 bg-muted rounded mb-2' />
          <div className='h-3 w-40 bg-muted rounded' />
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='flex items-center gap-4'>
                <div className='h-4 w-32 bg-muted rounded' />
                <div className='h-4 w-24 bg-muted rounded' />
                <div className='h-4 w-16 bg-muted rounded' />
                <div className='h-4 w-16 bg-muted rounded' />
                <div className='h-4 w-16 bg-muted rounded' />
                <div className='h-4 w-16 bg-muted rounded' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
