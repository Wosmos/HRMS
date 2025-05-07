"use client"

import { useState } from "react"
import { Calendar, Download, BarChart3, Users, Clock, Check, ChevronsUpDown, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { employees } from "@/lib/data"

// Sample data for charts
const attendanceData = [
  { month: "Jan", present: 22, absent: 1, leave: 2 },
  { month: "Feb", present: 20, absent: 0, leave: 0 },
  { month: "Mar", present: 21, absent: 1, leave: 1 },
  { month: "Apr", present: 19, absent: 2, leave: 1 },
  { month: "May", present: 22, absent: 0, leave: 0 },
  { month: "Jun", present: 20, absent: 1, leave: 1 },
]

const departmentData = [
  { name: "Engineering", value: 35 },
  { name: "Marketing", value: 15 },
  { name: "Sales", value: 20 },
  { name: "HR", value: 10 },
  { name: "Finance", value: 12 },
  { name: "Operations", value: 8 },
]

const performanceData = [
  { month: "Jan", performance: 85 },
  { month: "Feb", performance: 88 },
  { month: "Mar", performance: 87 },
  { month: "Apr", performance: 90 },
  { month: "May", performance: 92 },
  { month: "Jun", performance: 91 },
]

const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", "#f5f3ff"]

const reportTypes = [
  { label: "Attendance Report", value: "attendance" },
  { label: "Performance Report", value: "performance" },
  { label: "Leave Report", value: "leave" },
  { label: "Payroll Report", value: "payroll" },
  { label: "Department Report", value: "department" },
]

const departments = [
  { label: "All Departments", value: "all" },
  { label: "Engineering", value: "engineering" },
  { label: "Human Resources", value: "hr" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Finance", value: "finance" },
  { label: "Operations", value: "operations" },
]

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState(reportTypes[0])
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0])
  const [openReportType, setOpenReportType] = useState(false)
  const [openDepartment, setOpenDepartment] = useState(false)
  const [dateRange, setDateRange] = useState({ from: "2023-01-01", to: "2023-06-30" })

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and analyze reports for your organization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Report Options</CardTitle>
            <CardDescription>Configure your report parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Popover open={openReportType} onOpenChange={setOpenReportType}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openReportType}
                    className="justify-between w-full"
                  >
                    {selectedReportType.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search report type..." />
                    <CommandList>
                      <CommandEmpty>No report type found.</CommandEmpty>
                      <CommandGroup>
                        {reportTypes.map((type) => (
                          <CommandItem
                            key={type.value}
                            value={type.value}
                            onSelect={() => {
                              setSelectedReportType(type)
                              setOpenReportType(false)
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedReportType.value === type.value ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {type.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openDepartment}
                    className="justify-between w-full"
                  >
                    {selectedDepartment.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search department..." />
                    <CommandList>
                      <CommandEmpty>No department found.</CommandEmpty>
                      <CommandGroup>
                        {departments.map((department) => (
                          <CommandItem
                            key={department.value}
                            value={department.value}
                            onSelect={() => {
                              setSelectedDepartment(department)
                              setOpenDepartment(false)
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedDepartment.value === department.value ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {department.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from">Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="date-from" className="text-xs">
                    From
                  </Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="date-to" className="text-xs">
                    To
                  </Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Generate Report</Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>
              {selectedReportType.label}: {selectedDepartment.label}
            </CardTitle>
            <CardDescription>
              Data from {dateRange.from} to {dateRange.to}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chart">Chart View</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="data">Data Table</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {selectedReportType.value === "attendance" && (
                    <>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Attendance Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ChartContainer
                            config={{
                              present: {
                                label: "Present",
                                color: "hsl(var(--primary))",
                              },
                              absent: {
                                label: "Absent",
                                color: "hsl(var(--destructive))",
                              },
                              leave: {
                                label: "Leave",
                                color: "hsl(var(--warning))",
                              },
                            }}
                            className="h-[300px]"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="present" fill="var(--color-present)" />
                                <Bar dataKey="absent" fill="var(--color-absent)" />
                                <Bar dataKey="leave" fill="var(--color-leave)" />
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Attendance Rate</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <RePieChart>
                                <Pie
                                  data={[
                                    { name: "Present", value: 124 },
                                    { name: "Absent", value: 5 },
                                    { name: "Leave", value: 5 },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                  {[
                                    { name: "Present", value: 124, color: "hsl(var(--primary))" },
                                    { name: "Absent", value: 5, color: "hsl(var(--destructive))" },
                                    { name: "Leave", value: 5, color: "hsl(var(--warning))" },
                                  ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </RePieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {selectedReportType.value === "department" && (
                    <>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Department Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <RePieChart>
                                <Pie
                                  data={departmentData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                  {departmentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </RePieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Department Headcount</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ChartContainer
                            config={{
                              value: {
                                label: "Employees",
                                color: "hsl(var(--primary))",
                              },
                            }}
                            className="h-[300px]"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={departmentData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="value" fill="var(--color-value)" />
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {selectedReportType.value === "performance" && (
                    <>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Performance Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ChartContainer
                            config={{
                              performance: {
                                label: "Performance",
                                color: "hsl(var(--primary))",
                              },
                            }}
                            className="h-[300px]"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={[0, 100]} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                  type="monotone"
                                  dataKey="performance"
                                  stroke="var(--color-performance)"
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Performance Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <RePieChart>
                                <Pie
                                  data={[
                                    { name: "Excellent (90-100)", value: 15 },
                                    { name: "Good (80-89)", value: 25 },
                                    { name: "Average (70-79)", value: 10 },
                                    { name: "Below Average (<70)", value: 5 },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                  {[
                                    { name: "Excellent (90-100)", value: 15, color: "#10b981" },
                                    { name: "Good (80-89)", value: 25, color: "#8b5cf6" },
                                    { name: "Average (70-79)", value: 10, color: "#f59e0b" },
                                    { name: "Below Average (<70)", value: 5, color: "#ef4444" },
                                  ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </RePieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {selectedReportType.value === "attendance" && (
                    <>
                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                          <div className="rounded-full p-3 bg-primary/10 mb-4">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-3xl font-bold">55</div>
                          <p className="text-sm text-muted-foreground">Total Employees</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                          <div className="rounded-full p-3 bg-success/10 mb-4">
                            <Clock className="h-6 w-6 text-success" />
                          </div>
                          <div className="text-3xl font-bold">92.5%</div>
                          <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                          <div className="rounded-full p-3 bg-warning/10 mb-4">
                            <Calendar className="h-6 w-6 text-warning" />
                          </div>
                          <div className="text-3xl font-bold">5</div>
                          <p className="text-sm text-muted-foreground">Avg. Leave Days</p>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {selectedReportType.value === "department" && (
                    <>
                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                          <div className="rounded-full p-3 bg-primary/10 mb-4">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-3xl font-bold">100</div>
                          <p className="text-sm text-muted-foreground">Total Employees</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                          <div className="rounded-full p-3 bg-success/10 mb-4">
                            <BarChart3 className="h-6 w-6 text-success" />
                          </div>
                          <div className="text-3xl font-bold">6</div>
                          <p className="text-sm text-muted-foreground">Departments</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                          <div className="rounded-full p-3 bg-warning/10 mb-4">
                            <Users className="h-6 w-6 text-warning" />
                          </div>
                          <div className="text-3xl font-bold">35</div>
                          <p className="text-sm text-muted-foreground">Largest Department</p>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {selectedReportType.value === "performance" && (
                    <>
                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                          <div className="rounded-full p-3 bg-primary/10 mb-4">
                            <BarChart3 className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-3xl font-bold">88.8%</div>
                          <p className="text-sm text-muted-foreground">Avg. Performance</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                          <div className="rounded-full p-3 bg-success/10 mb-4">
                            <Users className="h-6 w-6 text-success" />
                          </div>
                          <div className="text-3xl font-bold">15</div>
                          <p className="text-sm text-muted-foreground">Top Performers</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                          <div className="rounded-full p-3 bg-destructive/10 mb-4">
                            <Users className="h-6 w-6 text-destructive" />
                          </div>
                          <div className="text-3xl font-bold">5</div>
                          <p className="text-sm text-muted-foreground">Needs Improvement</p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedReportType.value === "attendance" && (
                        <>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>
                              Overall attendance rate is 92.5%, which is 2.5% higher than the previous period.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>The Engineering department has the highest attendance rate at 95%.</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>April had the lowest attendance rate due to seasonal holidays.</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>5 employees have perfect attendance records for the entire period.</span>
                          </li>
                        </>
                      )}

                      {selectedReportType.value === "department" && (
                        <>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>
                              Engineering is the largest department with 35 employees (35% of total workforce).
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>The HR department has the highest retention rate at 95%.</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Sales department has grown by 15% in the last quarter.</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Operations has the highest average tenure at 4.2 years.</span>
                          </li>
                        </>
                      )}

                      {selectedReportType.value === "performance" && (
                        <>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>
                              Average performance score is 88.8%, which is 3.2% higher than the previous period.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>15 employees (27%) are rated as excellent performers.</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Performance has shown a steady increase over the last 6 months.</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                            <span>5 employees need performance improvement plans.</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <div className="rounded-md border mt-4">
                  {selectedReportType.value === "attendance" && (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">Employee</th>
                          <th className="py-3 px-4 text-left font-medium">Department</th>
                          <th className="py-3 px-4 text-left font-medium">Present Days</th>
                          <th className="py-3 px-4 text-left font-medium">Absent Days</th>
                          <th className="py-3 px-4 text-left font-medium">Leave Days</th>
                          <th className="py-3 px-4 text-left font-medium">Attendance Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.slice(0, 10).map((employee, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-3 px-4">{employee.name}</td>
                            <td className="py-3 px-4 capitalize">{employee.department}</td>
                            <td className="py-3 px-4">{Math.floor(Math.random() * 10) + 18}</td>
                            <td className="py-3 px-4">{Math.floor(Math.random() * 3)}</td>
                            <td className="py-3 px-4">{Math.floor(Math.random() * 3)}</td>
                            <td className="py-3 px-4">{(Math.random() * 10 + 85).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedReportType.value === "department" && (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">Department</th>
                          <th className="py-3 px-4 text-left font-medium">Headcount</th>
                          <th className="py-3 px-4 text-left font-medium">Avg. Tenure (years)</th>
                          <th className="py-3 px-4 text-left font-medium">Turnover Rate</th>
                          <th className="py-3 px-4 text-left font-medium">Avg. Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departmentData.map((dept, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-3 px-4">{dept.name}</td>
                            <td className="py-3 px-4">{dept.value}</td>
                            <td className="py-3 px-4">{(Math.random() * 3 + 2).toFixed(1)}</td>
                            <td className="py-3 px-4">{(Math.random() * 10).toFixed(1)}%</td>
                            <td className="py-3 px-4">{(Math.random() * 10 + 80).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedReportType.value === "performance" && (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">Employee</th>
                          <th className="py-3 px-4 text-left font-medium">Department</th>
                          <th className="py-3 px-4 text-left font-medium">Performance Score</th>
                          <th className="py-3 px-4 text-left font-medium">Previous Score</th>
                          <th className="py-3 px-4 text-left font-medium">Change</th>
                          <th className="py-3 px-4 text-left font-medium">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.slice(0, 10).map((employee, i) => {
                          const currentScore = Math.floor(Math.random() * 20) + 75
                          const prevScore = Math.floor(Math.random() * 20) + 75
                          const change = currentScore - prevScore

                          return (
                            <tr key={i} className="border-b">
                              <td className="py-3 px-4">{employee.name}</td>
                              <td className="py-3 px-4 capitalize">{employee.department}</td>
                              <td className="py-3 px-4">{currentScore}%</td>
                              <td className="py-3 px-4">{prevScore}%</td>
                              <td className="py-3 px-4">
                                <span className={change >= 0 ? "text-success" : "text-destructive"}>
                                  {change >= 0 ? "+" : ""}
                                  {change}%
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {currentScore >= 90 ? (
                                  <Badge variant="success">Excellent</Badge>
                                ) : currentScore >= 80 ? (
                                  <Badge variant="default">Good</Badge>
                                ) : currentScore >= 70 ? (
                                  <Badge variant="warning">Average</Badge>
                                ) : (
                                  <Badge variant="destructive">Needs Improvement</Badge>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
