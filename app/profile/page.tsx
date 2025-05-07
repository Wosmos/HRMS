"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  getAttendanceByUserId,
  getLeavesByUserId,
  getShiftAssignmentByUserId,
  getShiftById,
  getUserManager,
} from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { AtSign, Building, Calendar, Clock, MapPin, Phone, User, UserCircle } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  const manager = getUserManager(user.id)
  const attendance = getAttendanceByUserId(user.id)
  const leaves = getLeavesByUserId(user.id)
  const shiftAssignment = getShiftAssignmentByUserId(user.id)
  const shift = shiftAssignment ? getShiftById(shiftAssignment.shiftId) : null

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    alert("Profile updated!")
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and settings.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{user.position}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <AtSign className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.address || "Not provided"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Joined:{" "}
                    {new Date(user.joinDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {manager && (
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Manager: {manager.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="work">Work</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="space-y-4 pt-4">
                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user.email} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" defaultValue={user.phone || ""} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" defaultValue={user.address || ""} />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-muted-foreground">Full Name</Label>
                          <p>{user.name}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-muted-foreground">Email</Label>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-muted-foreground">Phone</Label>
                          <p>{user.phone || "Not provided"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-muted-foreground">Address</Label>
                          <p>{user.address || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="work" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Department</Label>
                      <p>{user.department}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Position</Label>
                      <p>{user.position}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Join Date</Label>
                      <p>
                        {new Date(user.joinDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Manager</Label>
                      <p>{manager?.name || "None"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Current Shift</Label>
                      <p>{shift?.name || "Not assigned"}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Working Hours</Label>
                      <p>{shift ? `${shift.startTime} - ${shift.endTime}` : "Not assigned"}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="security" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Change Password</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>Your recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendance
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {record.checkIn} - {record.checkOut || "Not checked out"}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          record.status === "present" ? "default" : record.status === "late" ? "outline" : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Leaves</CardTitle>
              <CardDescription>Your recent leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaves
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">{leave.type} Leave</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(leave.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(leave.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          leave.status === "approved"
                            ? "default"
                            : leave.status === "pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {leave.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
