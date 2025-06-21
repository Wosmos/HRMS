'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { attendanceRecords, getUserById } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function AttendancePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Check if user is already checked in today
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = attendanceRecords.find(
        (record) => record.userId === user.id && record.date === today
      );

      if (todayRecord) {
        setIsCheckedIn(true);
        setCheckInTime(todayRecord.checkIn);
      }
    }
  }, [user]);

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    setIsCheckedIn(true);
    setCheckInTime(timeString);

    // In a real app, you would send this to the server
    alert(`Checked in at ${timeString}`);
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // In a real app, you would send this to the server
    alert(`Checked out at ${timeString}`);

    // Reset state after a short delay to simulate page refresh
    setTimeout(() => {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }, 1000);
  };

  if (isLoading || !user) {
    return null;
  }

  // Filter records based on user role
  const filteredRecords = attendanceRecords.filter((record) => {
    if (
      user.role === 'super_admin' ||
      user.role === 'admin' ||
      user.role === 'finance'
    ) {
      return true; // See all records
    } else if (user.role === 'manager') {
      // See records of team members and self
      const recordUser = getUserById(record.userId);
      return recordUser?.manager === user.id || record.userId === user.id;
    } else {
      // Employee can only see their own records
      return record.userId === user.id;
    }
  });

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Attendance</h1>
        <p className='text-muted-foreground'>
          Track your daily attendance and view attendance history.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Attendance</CardTitle>
            <CardDescription>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col items-center space-y-4'>
              <div className='flex items-center justify-center space-x-2'>
                <Clock className='h-5 w-5 text-muted-foreground' />
                <span className='text-xl font-medium'>
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>

              {isCheckedIn ? (
                <div className='space-y-4 text-center'>
                  <div className='rounded-lg bg-primary/10 p-4'>
                    <CheckCircle2 className='mx-auto h-8 w-8 text-primary' />
                    <p className='mt-2 font-medium'>You are checked in</p>
                    <p className='text-sm text-muted-foreground'>
                      Check-in time: {checkInTime}
                    </p>
                  </div>
                  <Button onClick={handleCheckOut}>Check Out</Button>
                </div>
              ) : (
                <Button onClick={handleCheckIn}>Check In</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              View your attendance for the month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode='single'
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className='rounded-md border'
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='attendance-sheet'>
        <TabsList>
          <TabsTrigger value='attendance-sheet'>Attendance Sheet</TabsTrigger>
          {(user.role === 'super_admin' ||
            user.role === 'admin' ||
            user.role === 'manager' ||
            user.role === 'finance') && (
            <TabsTrigger value='team-attendance'>Team Attendance</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value='attendance-sheet' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Your Attendance History</CardTitle>
              <CardDescription>
                View your attendance records for the past month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Work Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords
                    .filter((record) => record.userId === user.id)
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>{record.checkIn}</TableCell>
                        <TableCell>{record.checkOut || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === 'present'
                                ? 'default'
                                : record.status === 'late'
                                ? 'outline'
                                : 'destructive'
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.workHours || '-'}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {(user.role === 'super_admin' ||
          user.role === 'admin' ||
          user.role === 'manager' ||
          user.role === 'finance') && (
          <TabsContent value='team-attendance' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Team Attendance</CardTitle>
                <CardDescription>
                  View attendance records for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Work Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords
                      .filter((record) => record.userId !== user.id)
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((record) => {
                        const employee = getUserById(record.userId);
                        return (
                          <TableRow key={record.id}>
                            <TableCell className='font-medium'>
                              {employee?.name || 'Unknown'}
                            </TableCell>
                            <TableCell>
                              {new Date(record.date).toLocaleDateString(
                                'en-US',
                                {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </TableCell>
                            <TableCell>{record.checkIn}</TableCell>
                            <TableCell>{record.checkOut || '-'}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  record.status === 'present'
                                    ? 'default'
                                    : record.status === 'late'
                                    ? 'outline'
                                    : 'destructive'
                                }
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.workHours || '-'}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
