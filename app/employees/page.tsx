"use client"

import { useState, useRef } from "react"
import { Search, UserPlus, Download, Upload, MoreHorizontal, Check, ChevronsUpDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const departments = [
  { label: "All Departments", value: "all" },
  { label: "Engineering", value: "engineering" },
  { label: "Human Resources", value: "hr" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Finance", value: "finance" },
  { label: "Operations", value: "operations" },
]

// Add this type to match the CSV schema
type Employee = {
  id: string
  name: string
  email: string
  password: string
  role: string
  department: string
  position: string
  avatar: string
  phone: string
  address: string
  date_of_birth: string
  cnic: string
  gender: string
  join_date: string
  is_deleted: string
  is_manager: string
  leave_balance: string
}

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0])
  const [openDepartment, setOpenDepartment] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [importError, setImportError] = useState("")
  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter employees based on search, department, and status
  const filteredEmployees = employeeList.filter((employee: Employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = selectedDepartment.value === "all" || employee.department === selectedDepartment.value

    return matchesSearch && matchesDepartment
  })

  // Add Employee Handler
  const handleAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
      department: formData.get("department") as string,
      position: formData.get("position") as string,
      avatar: formData.get("avatar") as string || "",
      phone: formData.get("phone") as string || "",
      address: formData.get("address") as string || "",
      date_of_birth: formData.get("date_of_birth") as string || "",
      cnic: formData.get("cnic") as string || "",
      gender: formData.get("gender") as string || "",
      join_date: formData.get("join_date") as string,
      is_deleted: formData.get("is_deleted") === "true" ? "true" : "false",
      is_manager: formData.get("is_manager") === "true" ? "true" : "false",
      leave_balance: formData.get("leave_balance") as string || "30",
    }
    setEmployeeList([newEmployee, ...employeeList])
    setIsAddOpen(false)
    form.reset()
  }

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      "id","name","email","password","role","department","position","avatar","phone","address","date_of_birth","cnic","gender","join_date","is_deleted","is_manager","leave_balance"
    ]
    const rows = employeeList.map(emp => [
      emp.id, emp.name, emp.email, emp.password, emp.role, emp.department, emp.position, emp.avatar, emp.phone, emp.address, emp.date_of_birth, emp.cnic, emp.gender, emp.join_date, emp.is_deleted, emp.is_manager, emp.leave_balance
    ])
    const csvContent = [headers, ...rows].map(row => row.map(val => `"${val ?? ''}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'employees.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Import CSV Handler
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("")
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split(/\r?\n/).filter(Boolean)
        const [header, ...rows] = lines
        const headerFields = header.split(',').map(h => h.replace(/"/g, '').trim().toLowerCase())
        const required = [
          "id","name","email","password","role","department","position","avatar","phone","address","date_of_birth","cnic","gender","join_date","is_deleted","is_manager","leave_balance"
        ]
        if (!required.every(r => headerFields.includes(r))) {
          setImportError("CSV must have columns: " + required.join(", "))
          return
        }
        const newEmployees: Employee[] = rows.map(row => {
          // Handle quoted CSV values and commas inside quotes
          const values = row.match(/("[^"]*"|[^,]+)/g)?.map(v => v.replace(/"/g, '')) || []
          return {
            id: values[headerFields.indexOf("id")] || Date.now().toString() + Math.random(),
            name: values[headerFields.indexOf("name")] || "",
            email: values[headerFields.indexOf("email")] || "",
            password: values[headerFields.indexOf("password")] || "",
            role: values[headerFields.indexOf("role")] || "",
            department: values[headerFields.indexOf("department")] || "",
            position: values[headerFields.indexOf("position")] || "",
            avatar: values[headerFields.indexOf("avatar")] || "",
            phone: values[headerFields.indexOf("phone")] || "",
            address: values[headerFields.indexOf("address")] || "",
            date_of_birth: values[headerFields.indexOf("date_of_birth")] || "",
            cnic: values[headerFields.indexOf("cnic")] || "",
            gender: values[headerFields.indexOf("gender")] || "",
            join_date: values[headerFields.indexOf("join_date")] || "",
            is_deleted: values[headerFields.indexOf("is_deleted")] || "false",
            is_manager: values[headerFields.indexOf("is_manager")] || "false",
            leave_balance: values[headerFields.indexOf("leave_balance")] || "30",
          }
        })
        setEmployeeList([...newEmployees, ...employeeList])
        setIsImportOpen(false)
      } catch (err) {
        setImportError("Failed to import CSV. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="w-full mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
          <p className="text-muted-foreground">Manage and view all employees in your organization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Employees</CardTitle>
          <CardDescription>View and manage employee information, profiles, and status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openDepartment}
                    className="justify-between min-w-[200px]"
                  >
                    {selectedDepartment.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
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
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Is Manager</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No employees found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee: Employee) => (
                    <TableRow
                      key={employee.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setIsProfileOpen(true)
                      }}
                    >
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>{employee.join_date}</TableCell>
                      <TableCell>{employee.is_manager}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit employee</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Change status</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete employee</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Employee Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-3xl">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle>Employee Profile</DialogTitle>
                <DialogDescription>Detailed information about {selectedEmployee.name}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="col-span-1 flex flex-col items-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={selectedEmployee.avatar || "/placeholder.svg"} alt={selectedEmployee.name} />
                    <AvatarFallback className="text-2xl">
                      {selectedEmployee.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-xl font-semibold">{selectedEmployee.name}</h3>
                  <p className="text-muted-foreground">{selectedEmployee.position}</p>

                  <div className="w-full mt-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium capitalize">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Joined:</span>
                      <span className="font-medium">{selectedEmployee.join_date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Employee ID:</span>
                      <span className="font-medium">{selectedEmployee.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reports to:</span>
                      <span className="font-medium">{selectedEmployee.manager || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <Tabs defaultValue="info">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="info">Info</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="history">Job History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h4>
                          <Card>
                            <CardContent className="p-4 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span>{selectedEmployee.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone:</span>
                                <span>{selectedEmployee.phone || "+1 (555) 123-4567"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Address:</span>
                                <span>{selectedEmployee.address || "123 Main St, City"}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Personal Information</h4>
                          <Card>
                            <CardContent className="p-4 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Birthday:</span>
                                <span>{selectedEmployee.date_of_birth || "Jan 15, 1985"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Gender:</span>
                                <span>{selectedEmployee.gender || "Prefer not to say"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Nationality:</span>
                                <span>{selectedEmployee.cnic || "United States"}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Skills & Expertise</h4>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {(
                                selectedEmployee.skills || [
                                  "Leadership",
                                  "Communication",
                                  "Problem Solving",
                                  "Team Management",
                                  "Strategic Planning",
                                ]
                              ).map((skill: string, i: number) => (
                                <Badge key={i} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Emergency Contact</h4>
                        <Card>
                          <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Name:</span>
                              <span>{selectedEmployee.emergencyContact?.name || "Jane Doe"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Relationship:</span>
                              <span>{selectedEmployee.emergencyContact?.relationship || "Spouse"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Phone:</span>
                              <span>{selectedEmployee.emergencyContact?.phone || "+1 (555) 987-6543"}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-4 pt-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Performance Overview</h4>
                          <p className="text-muted-foreground mb-4">Latest performance metrics and reviews</p>

                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Communication</span>
                                <span className="text-sm font-medium">85%</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Technical Skills</span>
                                <span className="text-sm font-medium">92%</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Teamwork</span>
                                <span className="text-sm font-medium">78%</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Leadership</span>
                                <span className="text-sm font-medium">80%</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "80%" }}></div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h5 className="font-medium mb-2">Latest Review</h5>
                            <div className="bg-muted p-3 rounded-md">
                              <p className="italic text-sm">
                                "{selectedEmployee.name} has shown exceptional performance in the last quarter. Their
                                technical skills and problem-solving abilities have been instrumental in the success of
                                the project. Areas for improvement include delegation and time management." Areas for
                                improvement include delegation and time management."
                              </p>
                              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                <span>Reviewed by: Sarah Johnson (Manager)</span>
                                <span>Date: April 15, 2023</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4 pt-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Employee Documents</h4>
                          <p className="text-muted-foreground mb-4">Important documents and certificates</p>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-md">
                                  <svg
                                    className="h-4 w-4 text-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Employment Contract</p>
                                  <p className="text-xs text-muted-foreground">
                                    PDF • 2.4 MB • Uploaded on Jan 10, 2022
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-md">
                                  <svg
                                    className="h-4 w-4 text-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Resume</p>
                                  <p className="text-xs text-muted-foreground">
                                    PDF • 1.8 MB • Uploaded on Jan 5, 2022
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-md">
                                  <svg
                                    className="h-4 w-4 text-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">ID Documents</p>
                                  <p className="text-xs text-muted-foreground">
                                    ZIP • 5.2 MB • Uploaded on Jan 8, 2022
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4 pt-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Job History</h4>
                          <p className="text-muted-foreground mb-4">Career progression within the company</p>

                          <div className="relative border-l-2 border-muted pl-6 pb-2">
                            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                            <div className="mb-6">
                              <h5 className="text-sm font-medium">{selectedEmployee.position}</h5>
                              <p className="text-xs text-muted-foreground">Jan 2022 - Present</p>
                              <p className="mt-2 text-sm">
                                Leading a team of developers to build and maintain enterprise applications. Responsible
                                for architecture decisions and technical direction.
                              </p>
                            </div>

                            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-muted-foreground"></div>
                            <div className="mb-6">
                              <h5 className="text-sm font-medium">Senior Developer</h5>
                              <p className="text-xs text-muted-foreground">Mar 2020 - Dec 2021</p>
                              <p className="mt-2 text-sm">
                                Developed and maintained key features for the company's flagship product. Mentored
                                junior developers and led small project teams.
                              </p>
                            </div>

                            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-muted-foreground"></div>
                            <div>
                              <h5 className="text-sm font-medium">Developer</h5>
                              <p className="text-xs text-muted-foreground">Jun 2018 - Feb 2020</p>
                              <p className="mt-2 text-sm">
                                Worked on front-end and back-end development for various projects. Collaborated with
                                design and product teams to implement new features.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Add Employee Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-bold">Add New Employee</DialogTitle>
            <DialogDescription className="text-muted-foreground">Fill in the details to add a new employee.</DialogDescription>
          </DialogHeader>
          <form className="bg-muted/40 px-6 pb-6 pt-2 rounded-b-xl w-full" onSubmit={handleAddEmployee}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input name="name" placeholder="Full Name" required className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input name="email" placeholder="Email" type="email" required className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input name="password" placeholder="Password" required className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role (number)</label>
                <Input name="role" placeholder="Role (number)" required className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <Input name="department" placeholder="Department" required className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <Input name="position" placeholder="Position" required className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Avatar URL</label>
                <Input name="avatar" placeholder="Avatar URL (optional)" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input name="phone" placeholder="Phone (optional)" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input name="address" placeholder="Address (optional)" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <Input name="date_of_birth" placeholder="YYYY-MM-DD (optional)" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CNIC</label>
                <Input name="cnic" placeholder="CNIC (optional)" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <Input name="gender" placeholder="Gender (optional)" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Join Date</label>
                <Input name="join_date" placeholder="YYYY-MM-DD" required className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Is Deleted</label>
                <Input name="is_deleted" placeholder="Is Deleted (true/false)" defaultValue="false" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Is Manager</label>
                <Input name="is_manager" placeholder="Is Manager (true/false)" defaultValue="false" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Leave Balance</label>
                <Input name="leave_balance" placeholder="Leave Balance (default 30)" defaultValue="30" className="w-full" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-end gap-2 mt-6">
              <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)} className="w-full md:w-auto">Cancel</Button>
              <Button type="submit" className="w-full md:w-auto">Add</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Import CSV Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Employees from CSV</DialogTitle>
            <DialogDescription>Upload a CSV file with columns: Name, Email, Department, Position, Status, Join Date.</DialogDescription>
          </DialogHeader>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="mb-2"
            onChange={handleImportCSV}
          />
          {importError && <div className="text-red-500 text-sm mb-2">{importError}</div>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsImportOpen(false)}>Cancel</Button>
            <Button type="button" onClick={() => fileInputRef.current?.click()}>Choose File</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
