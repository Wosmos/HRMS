'use client';

import type React from 'react';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { leaveRequests, getUserById } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LeavesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null;
  }

  // Filter leave requests based on user role
  const filteredLeaves = leaveRequests.filter((leave) => {
    if (
      user.role === 'super_admin' ||
      user.role === 'admin' ||
      user.role === 'finance'
    ) {
      return true; // See all leaves
    } else if (user.role === 'manager') {
      // See leaves of team members and self
      const leaveUser = getUserById(leave.userId);
      return leaveUser?.manager === user.id || leave.userId === user.id;
    } else {
      // Employee can only see their own leaves
      return leave.userId === user.id;
    }
  });

  const handleApprove = (leaveId: string) => {
    alert(`Leave ${leaveId} approved!`);
  };

  const handleReject = (leaveId: string) => {
    alert(`Leave ${leaveId} rejected!`);
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Leave request submitted!');
    setIsDialogOpen(false);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Leaves</h1>
          <p className='text-muted-foreground'>
            Manage your leave requests and approvals.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileText className='mr-2 h-4 w-4' />
              Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <form onSubmit={handleSubmitLeave}>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Fill out the form below to submit a leave request.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='leave-type'>Leave Type</Label>
                  <Select required>
                    <SelectTrigger id='leave-type'>
                      <SelectValue placeholder='Select leave type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='annual'>Annual Leave</SelectItem>
                      <SelectItem value='sick'>Sick Leave</SelectItem>
                      <SelectItem value='personal'>Personal Leave</SelectItem>
                      <SelectItem value='maternity'>Maternity Leave</SelectItem>
                      <SelectItem value='paternity'>Paternity Leave</SelectItem>
                      <SelectItem value='unpaid'>Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='start-date'>Start Date</Label>
                    <Input id='start-date' type='date' required />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='end-date'>End Date</Label>
                    <Input id='end-date' type='date' required />
                  </div>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='reason'>Reason</Label>
                  <Textarea
                    id='reason'
                    placeholder='Provide a reason for your leave request'
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue='my-leaves'>
        <TabsList>
          <TabsTrigger value='my-leaves'>My Leaves</TabsTrigger>
          {(user.role === 'super_admin' ||
            user.role === 'admin' ||
            user.role === 'manager' ||
            user.role === 'finance') && (
            <TabsTrigger value='team-leaves'>Team Leaves</TabsTrigger>
          )}
          {(user.role === 'super_admin' ||
            user.role === 'admin' ||
            user.role === 'manager') && (
            <TabsTrigger value='pending-approvals'>
              Pending Approvals
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value='my-leaves' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Your Leave Requests</CardTitle>
              <CardDescription>
                View and manage your leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaves
                    .filter((leave) => leave.userId === user.id)
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((leave) => {
                      const approver = leave.approvedBy
                        ? getUserById(leave.approvedBy)
                        : null;
                      return (
                        <TableRow key={leave.id}>
                          <TableCell className='font-medium capitalize'>
                            {leave.type}
                          </TableCell>
                          <TableCell>
                            {new Date(leave.startDate).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(leave.endDate).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                leave.status === 'approved'
                                  ? 'default'
                                  : leave.status === 'pending'
                                  ? 'outline'
                                  : 'destructive'
                              }
                            >
                              {leave.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{approver?.name || '-'}</TableCell>
                          <TableCell>
                            {new Date(leave.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {(user.role === 'super_admin' ||
          user.role === 'admin' ||
          user.role === 'manager' ||
          user.role === 'finance') && (
          <TabsContent value='team-leaves' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Team Leave Requests</CardTitle>
                <CardDescription>
                  View leave requests for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaves
                      .filter((leave) => leave.userId !== user.id)
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((leave) => {
                        const employee = getUserById(leave.userId);
                        return (
                          <TableRow key={leave.id}>
                            <TableCell className='font-medium'>
                              {employee?.name || 'Unknown'}
                            </TableCell>
                            <TableCell className='capitalize'>
                              {leave.type}
                            </TableCell>
                            <TableCell>
                              {new Date(leave.startDate).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(leave.endDate).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  leave.status === 'approved'
                                    ? 'default'
                                    : leave.status === 'pending'
                                    ? 'outline'
                                    : 'destructive'
                                }
                              >
                                {leave.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(leave.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {(user.role === 'super_admin' ||
          user.role === 'admin' ||
          user.role === 'manager') && (
          <TabsContent value='pending-approvals' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>
                  Approve or reject leave requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaves
                      .filter(
                        (leave) =>
                          leave.status === 'pending' && leave.userId !== user.id
                      )
                      .map((leave) => {
                        const employee = getUserById(leave.userId);
                        return (
                          <TableRow key={leave.id}>
                            <TableCell className='font-medium'>
                              {employee?.name || 'Unknown'}
                            </TableCell>
                            <TableCell className='capitalize'>
                              {leave.type}
                            </TableCell>
                            <TableCell>
                              {new Date(leave.startDate).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(leave.endDate).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </TableCell>
                            <TableCell>{leave.reason}</TableCell>
                            <TableCell>
                              <div className='flex space-x-2'>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  className='h-8 w-8 p-0'
                                  onClick={() => handleApprove(leave.id)}
                                >
                                  <CheckCircle className='h-4 w-4 text-green-500' />
                                  <span className='sr-only'>Approve</span>
                                </Button>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  className='h-8 w-8 p-0'
                                  onClick={() => handleReject(leave.id)}
                                >
                                  <XCircle className='h-4 w-4 text-red-500' />
                                  <span className='sr-only'>Reject</span>
                                </Button>
                              </div>
                            </TableCell>
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
