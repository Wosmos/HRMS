"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardStats, getUserById } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, Users, FileText } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  return (

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Here&apos;s what&apos;s happening today.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.presentToday}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((dashboardStats.presentToday / dashboardStats.totalEmployees) * 100)}% attendance rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.pendingLeaves}</div>
              <p className="text-xs text-muted-foreground">Requires your attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Department Distribution</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.departmentDistribution.length}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
              <CardDescription>Daily attendance for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {dashboardStats.attendanceTrend.map((day, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground">
                        {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="mt-1 flex h-28 w-full flex-col-reverse">
                        <div
                          className="rounded-sm bg-primary"
                          style={{
                            height: `${(day.present / dashboardStats.totalEmployees) * 100}%`,
                          }}
                        />
                        {day.late > 0 && (
                          <div
                            className="rounded-sm bg-amber-500"
                            style={{
                              height: `${(day.late / dashboardStats.totalEmployees) * 100}%`,
                            }}
                          />
                        )}
                        {day.absent > 0 && (
                          <div
                            className="rounded-sm bg-destructive"
                            style={{
                              height: `${(day.absent / dashboardStats.totalEmployees) * 100}%`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center space-x-4 text-xs">
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-primary" />
                    <span>Present</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-amber-500" />
                    <span>Late</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-destructive" />
                    <span>Absent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Birthdays</CardTitle>
              <CardDescription>Celebrate with your colleagues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardStats.upcomingBirthdays.map((birthday) => {
                  const employee = getUserById(birthday.id)
                  if (!employee) return null
                  return (
                    <div key={birthday.id} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(birthday.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Employee count by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardStats.departmentDistribution.map((dept, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-full">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">{dept.department}</span>
                        <span className="text-sm text-muted-foreground">{dept.count}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(dept.count / dashboardStats.totalEmployees) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Leaves Taken</CardTitle>
              <CardDescription>Monthly leave statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardStats.leavesTaken.map((month, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-full">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">{month.month}</span>
                        <span className="text-sm text-muted-foreground">{month.count}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(month.count / 10) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
