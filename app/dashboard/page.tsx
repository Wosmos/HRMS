"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardStats, getUserById } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, Users, FileText, PieChart } from "lucide-react"
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, UserPlus, CalendarCheck2, Gift, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import * as RechartsPrimitive from "recharts"

// Mock data for top performers and recent activities
const topPerformers = [
  { name: "Alice Johnson", score: 97, avatar: "/placeholder.svg", department: "Engineering" },
  { name: "Bob Smith", score: 95, avatar: "/placeholder.svg", department: "Sales" },
  { name: "Carol Lee", score: 94, avatar: "/placeholder.svg", department: "HR" },
]
const recentActivities = [
  { type: "hire", text: "Hired John Doe as Software Engineer", time: "2h ago" },
  { type: "leave", text: "Approved leave for Jane Smith", time: "4h ago" },
  { type: "promotion", text: "Promoted Alice Johnson to Lead Developer", time: "1d ago" },
]

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
    <div className="space-y-8">
      {/* Header and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="default" className="shadow-md" onClick={() => router.push("/employees")}> <UserPlus className="h-4 w-4 mr-2" />Add Employee</Button>
          <Button variant="outline" className="shadow-md" onClick={() => router.push("/leaves")}> <CalendarCheck2 className="h-4 w-4 mr-2" />Approve Leave</Button>
          <Button variant="outline" className="shadow-md" onClick={() => router.push("/reports")}> <FileText className="h-4 w-4 mr-2" />View Reports</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Employees */}
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold animate-pulse">{dashboardStats.totalEmployees}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-600 font-semibold">+2</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
        {/* Present Today */}
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-br from-green-100/40 to-white dark:bg-gradient-to-br dark:from-green-100/40 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Clock className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold animate-pulse">{dashboardStats.presentToday}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-600 font-semibold">{Math.round((dashboardStats.presentToday / dashboardStats.totalEmployees) * 100)}%</span>
              <span className="text-muted-foreground">attendance rate</span>
            </div>
          </CardContent>
        </Card>
        {/* Pending Leaves */}
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-br from-yellow-100/40 to-white dark:bg-gradient-to-br dark:from-yellow-100/40 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <CalendarCheck2 className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold animate-pulse">{dashboardStats.pendingLeaves}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-red-600 font-semibold">-1</span>
              <span className="text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>
        {/* Departments */}
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-100/40 to-white dark:bg-gradient-to-br dark:from-blue-100/40 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <PieChart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold animate-pulse">{dashboardStats.departmentDistribution.length}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-600 font-semibold">+1</span>
              <span className="text-muted-foreground">active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Infographics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Attendance Trend Chart */}
        <Card className="col-span-4 hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background">
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
            <CardDescription>Daily attendance for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ present: { color: '#22c55e', label: 'Present' }, late: { color: '#fbbf24', label: 'Late' }, absent: { color: '#ef4444', label: 'Absent' } }}>
              <RechartsPrimitive.BarChart width={500} height={200} data={dashboardStats.attendanceTrend}>
                <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })} />
                <RechartsPrimitive.YAxis />
                <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                <RechartsPrimitive.Legend content={<ChartLegendContent />} />
                <RechartsPrimitive.Bar dataKey="present" fill="#22c55e" />
                <RechartsPrimitive.Bar dataKey="late" fill="#fbbf24" />
                <RechartsPrimitive.Bar dataKey="absent" fill="#ef4444" />
              </RechartsPrimitive.BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Upcoming Birthdays */}
        <Card className="col-span-3 hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background">
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
                    <Gift className="h-4 w-4 text-pink-500" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Distribution & Leaves Taken with Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Department Distribution Pie Chart */}
        <Card className="col-span-2 hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employee count by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={dashboardStats.departmentDistribution.reduce((acc: Record<string, { color?: string; label: string }>, dept) => { acc[dept.department] = { color: undefined, label: dept.department }; return acc }, {})}>
              <RechartsPrimitive.PieChart width={400} height={200}>
                <RechartsPrimitive.Pie data={dashboardStats.departmentDistribution} dataKey="count" nameKey="department" cx="50%" cy="50%" outerRadius={80} label>
                  {dashboardStats.departmentDistribution.map((entry, index) => (
                    <RechartsPrimitive.Cell key={`cell-${index}`} fill={["#3b82f6", "#22c55e", "#fbbf24", "#ef4444", "#a21caf", "#0ea5e9", "#f59e42"][index % 7]} />
                  ))}
                </RechartsPrimitive.Pie>
                <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                <RechartsPrimitive.Legend content={<ChartLegendContent />} />
              </RechartsPrimitive.PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Leaves Taken Bar Chart */}
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background">
          <CardHeader>
            <CardTitle>Leaves Taken</CardTitle>
            <CardDescription>Monthly leave statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ leaves: { color: '#3b82f6', label: 'Leaves' } }}>
              <RechartsPrimitive.BarChart width={300} height={200} data={dashboardStats.leavesTaken}>
                <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis dataKey="month" />
                <RechartsPrimitive.YAxis />
                <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                <RechartsPrimitive.Bar dataKey="count" fill="#3b82f6" />
              </RechartsPrimitive.BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers & Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Performers */}
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Recognizing outstanding employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((emp, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={emp.avatar} alt={emp.name} />
                    <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{emp.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{emp.department}</div>
                  </div>
                  <Badge variant="secondary" className="text-green-700 font-semibold">{emp.score}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Recent Activities */}
        <Card className="hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/10 to-white dark:bg-gradient-to-br dark:from-primary/10 dark:to-background">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Activity className={cn("h-4 w-4", act.type === "hire" ? "text-blue-500" : act.type === "leave" ? "text-yellow-500" : "text-green-500")} />
                  <div className="flex-1 text-sm">{act.text}</div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{act.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
