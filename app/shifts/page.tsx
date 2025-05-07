"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { shifts, shiftAssignments, getUserById, hasPermission, users } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Clock, Plus, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ShiftsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false)
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  const canManageShifts = hasPermission(user.role, "shifts", "create")

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Shift created!")
    setIsShiftDialogOpen(false)
  }

  const handleAssignShift = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Shift assigned!")
    setIsAssignmentDialogOpen(false)
  }

  // Get user's shift assignment
  const userShiftAssignment = shiftAssignments.find((assignment) => assignment.userId === user.id)

  const userShift = userShiftAssignment ? shifts.find((shift) => shift.id === userShiftAssignment.shiftId) : null

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shifts</h1>
            <p className="text-muted-foreground">Manage work shifts and schedules.</p>
          </div>
          {canManageShifts && (
            <div className="flex space-x-2">
              <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Shift
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleCreateShift}>
                    <DialogHeader>
                      <DialogTitle>Create New Shift</DialogTitle>
                      <DialogDescription>Define a new work shift schedule.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="shift-name">Shift Name</Label>
                        <Input id="shift-name" placeholder="e.g. Morning Shift" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="start-time">Start Time</Label>
                          <Input id="start-time" type="time" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="end-time">End Time</Label>
                          <Input id="end-time" type="time" required />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Working Days</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox id={`day-${day.toLowerCase()}`} />
                              <Label htmlFor={`day-${day.toLowerCase()}`} className="text-sm">
                                {day.substring(0, 3)}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Shift</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Assign Shift
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleAssignShift}>
                    <DialogHeader>
                      <DialogTitle>Assign Shift</DialogTitle>
                      <DialogDescription>Assign a shift to an employee.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="employee">Employee</Label>
                        <Select required>
                          <SelectTrigger id="employee">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="shift">Shift</Label>
                        <Select required>
                          <SelectTrigger id="shift">
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            {shifts.map((shift) => (
                              <SelectItem key={shift.id} value={shift.id}>
                                {shift.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" type="date" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end-date">End Date (Optional)</Label>
                        <Input id="end-date" type="date" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Assign Shift</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Current Shift</CardTitle>
            <CardDescription>Your assigned work schedule</CardDescription>
          </CardHeader>
          <CardContent>
            {userShift ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="px-3 py-1">
                    <Clock className="mr-2 h-4 w-4" />
                    {userShift.name}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Working Hours</p>
                    <p className="text-sm text-muted-foreground">
                      {userShift.startTime} - {userShift.endTime}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Working Days</p>
                    <p className="text-sm text-muted-foreground capitalize">{userShift.days.join(", ")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Assigned Since</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(userShiftAssignment?.startDate || "").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No shift assigned yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="all-shifts">
          <TabsList>
            <TabsTrigger value="all-shifts">All Shifts</TabsTrigger>
            {(user.role === "super_admin" || user.role === "admin" || user.role === "manager") && (
              <TabsTrigger value="shift-assignments">Shift Assignments</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all-shifts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Shifts</CardTitle>
                <CardDescription>All defined work shifts in the organization</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shift Name</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Working Days</TableHead>
                      {canManageShifts && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts.map((shift) => (
                      <TableRow key={shift.id}>
                        <TableCell className="font-medium">{shift.name}</TableCell>
                        <TableCell>{shift.startTime}</TableCell>
                        <TableCell>{shift.endTime}</TableCell>
                        <TableCell className="capitalize">{shift.days.join(", ")}</TableCell>
                        {canManageShifts && (
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {(user.role === "super_admin" || user.role === "admin" || user.role === "manager") && (
            <TabsContent value="shift-assignments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Shift Assignments</CardTitle>
                  <CardDescription>Current shift assignments for all employees</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Assigned Shift</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        {canManageShifts && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shiftAssignments.map((assignment) => {
                        const employee = getUserById(assignment.userId)
                        const shift = shifts.find((s) => s.id === assignment.shiftId)
                        return (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{employee?.name || "Unknown"}</TableCell>
                            <TableCell>{employee?.department || "Unknown"}</TableCell>
                            <TableCell>{shift?.name || "Unknown"}</TableCell>
                            <TableCell>
                              {new Date(assignment.startDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </TableCell>
                            <TableCell>
                              {assignment.endDate
                                ? new Date(assignment.endDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "Ongoing"}
                            </TableCell>
                            {canManageShifts && (
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  )
}
