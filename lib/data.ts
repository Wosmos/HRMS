export type User = {
  id: string
  name: string
  email: string
  role: string
  department: string
  position: string
  avatar?: string
  phone?: string
  address?: string
  joinDate: string
  manager?: string | null
}

export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "employee",
    department: "engineering",
    position: "Software Engineer",
    joinDate: "2022-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: "2",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    department: "hr",
    position: "HR Manager",
    joinDate: "2021-05-20",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: null,
  },
  {
    id: "3",
    name: "Robert Jones",
    email: "robert@example.com",
    role: "employee",
    department: "marketing",
    position: "Marketing Specialist",
    joinDate: "2022-03-10",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: "2",
  },
  {
    id: "4",
    name: "Emily White",
    email: "emily@example.com",
    role: "manager",
    department: "sales",
    position: "Sales Manager",
    joinDate: "2022-07-01",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: "2",
  },
  {
    id: "5",
    name: "David Green",
    email: "david@example.com",
    role: "finance",
    department: "finance",
    position: "Financial Analyst",
    joinDate: "2023-01-05",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: "2",
  },
  {
    id: "6",
    name: "Linda Brown",
    email: "linda@example.com",
    role: "super_admin",
    department: "operations",
    position: "Operations Director",
    joinDate: "2022-11-15",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: null,
  },
]

export const employees = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "engineering",
    position: "Software Engineer",
    status: "active",
    joinDate: "2022-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: "Jane Smith",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, CA 12345",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "hr",
    position: "HR Manager",
    status: "active",
    joinDate: "2021-05-20",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: null,
    phone: "+1 (555) 987-6543",
    address: "456 Elm St, Anytown, CA 12345",
  },
  {
    id: "3",
    name: "Robert Jones",
    email: "robert.jones@example.com",
    department: "marketing",
    position: "Marketing Specialist",
    status: "active",
    joinDate: "2022-03-10",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: "Jane Smith",
    phone: "+1 (555) 555-7890",
    address: "789 Oak St, Anytown, CA 12345",
  },
  {
    id: "4",
    name: "Emily White",
    email: "emily.white@example.com",
    department: "sales",
    position: "Sales Representative",
    status: "on-leave",
    joinDate: "2022-07-01",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: "Jane Smith",
    phone: "+1 (555) 111-2222",
    address: "101 Pine St, Anytown, CA 12345",
  },
  {
    id: "5",
    name: "David Green",
    email: "david.green@example.com",
    department: "finance",
    position: "Financial Analyst",
    status: "active",
    joinDate: "2023-01-05",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: "Jane Smith",
    phone: "+1 (555) 333-4444",
    address: "222 Maple St, Anytown, CA 12345",
  },
  {
    id: "6",
    name: "Linda Brown",
    email: "linda.brown@example.com",
    department: "operations",
    position: "Operations Manager",
    status: "active",
    joinDate: "2022-11-15",
    avatar: "/placeholder.svg?height=40&width=40",
    manager: "Jane Smith",
    phone: "+1 (555) 777-8888",
    address: "333 Cherry St, Anytown, CA 12345",
  },
]

export const attendance = [
  {
    id: "1",
    employeeId: "1",
    date: "2023-05-01",
    checkIn: "08:00",
    checkOut: "17:00",
  },
  {
    id: "2",
    employeeId: "2",
    date: "2023-05-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
]

export const leaves = [
  {
    id: "1",
    employeeId: "1",
    startDate: "2023-06-01",
    endDate: "2023-06-05",
    reason: "Vacation",
    status: "approved",
  },
  {
    id: "2",
    employeeId: "2",
    startDate: "2023-07-10",
    endDate: "2023-07-12",
    reason: "Sick leave",
    status: "pending",
  },
]

export function hasPermission(role: string, resource: string, action: string): boolean {
  // Define permissions based on roles
  const permissions: Record<string, Record<string, string[]>> = {
    super_admin: {
      // Super admin has access to everything
      "*": ["*"],
    },
    admin: {
      users: ["read", "create", "update", "delete"],
      attendance: ["read", "create", "update"],
      leaves: ["read", "create", "update", "approve"],
      shifts: ["read", "create", "update"],
      payroll: ["read", "process"],
    },
    manager: {
      users: ["read"],
      attendance: ["read"],
      leaves: ["read", "approve"],
      shifts: ["read"],
      payroll: ["read"],
    },
    finance: {
      payroll: ["read", "process"],
      users: ["read"],
    },
    employee: {
      attendance: ["read", "create"],
      leaves: ["read", "create"],
      shifts: ["read"],
      payroll: ["read"],
    },
  }

  // Check if role exists
  if (!permissions[role]) {
    return false
  }

  // Check for wildcard permission
  if (permissions[role]["*"] && permissions[role]["*"].includes("*")) {
    return true
  }

  // Check if resource exists for the role
  if (!permissions[role][resource]) {
    return false
  }

  // Check if action is allowed for the resource
  return permissions[role][resource].includes(action) || permissions[role][resource].includes("*")
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getUserManager(userId: string): User | null {
  const user = getUserById(userId)
  if (!user || !user.manager) return null
  return getUserById(user.manager) || null
}

export function getAttendanceByUserId(userId: string) {
  return attendanceRecords.filter((record) => record.userId === userId)
}

export function getLeavesByUserId(userId: string) {
  return leaveRequests.filter((leave) => leave.userId === userId)
}

export function getShiftAssignmentByUserId(userId: string) {
  return shiftAssignments.find((assignment) => assignment.userId === userId)
}

export function getShiftById(shiftId: string) {
  return shifts.find((shift) => shift.id === shiftId)
}

export const attendanceRecords = [
  {
    id: "1",
    userId: "1",
    date: "2023-05-01",
    checkIn: "08:00",
    checkOut: "17:00",
    status: "present",
    workHours: "9h 0m",
  },
  {
    id: "2",
    userId: "1",
    date: "2023-05-02",
    checkIn: "08:15",
    checkOut: "17:30",
    status: "present",
    workHours: "9h 15m",
  },
  {
    id: "3",
    userId: "1",
    date: "2023-05-03",
    checkIn: "09:00",
    checkOut: "18:00",
    status: "late",
    workHours: "9h 0m",
  },
  {
    id: "4",
    userId: "2",
    date: "2023-05-01",
    checkIn: "08:30",
    checkOut: "17:30",
    status: "present",
    workHours: "9h 0m",
  },
  {
    id: "5",
    userId: "2",
    date: "2023-05-02",
    checkIn: "08:45",
    checkOut: "17:45",
    status: "present",
    workHours: "9h 0m",
  },
  {
    id: "6",
    userId: "3",
    date: "2023-05-01",
    checkIn: "08:00",
    checkOut: "17:00",
    status: "present",
    workHours: "9h 0m",
  },
]

export const leaveRequests = [
  {
    id: "1",
    userId: "1",
    type: "annual",
    startDate: "2023-06-01",
    endDate: "2023-06-05",
    reason: "Vacation",
    status: "approved",
    approvedBy: "2",
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    userId: "1",
    type: "sick",
    startDate: "2023-07-10",
    endDate: "2023-07-12",
    reason: "Feeling unwell",
    status: "pending",
    approvedBy: null,
    createdAt: "2023-06-25",
  },
  {
    id: "3",
    userId: "2",
    type: "personal",
    startDate: "2023-08-15",
    endDate: "2023-08-16",
    reason: "Family event",
    status: "approved",
    approvedBy: "6",
    createdAt: "2023-07-20",
  },
  {
    id: "4",
    userId: "3",
    type: "annual",
    startDate: "2023-09-05",
    endDate: "2023-09-10",
    reason: "Vacation",
    status: "pending",
    approvedBy: null,
    createdAt: "2023-08-15",
  },
]

export const shifts = [
  {
    id: "1",
    name: "Morning Shift",
    startTime: "08:00",
    endTime: "16:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  {
    id: "2",
    name: "Afternoon Shift",
    startTime: "16:00",
    endTime: "00:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  {
    id: "3",
    name: "Night Shift",
    startTime: "00:00",
    endTime: "08:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  {
    id: "4",
    name: "Weekend Shift",
    startTime: "10:00",
    endTime: "18:00",
    days: ["saturday", "sunday"],
  },
]

export const shiftAssignments = [
  {
    id: "1",
    userId: "1",
    shiftId: "1",
    startDate: "2023-01-01",
    endDate: null,
  },
  {
    id: "2",
    userId: "2",
    shiftId: "1",
    startDate: "2023-01-01",
    endDate: null,
  },
  {
    id: "3",
    userId: "3",
    shiftId: "2",
    startDate: "2023-01-01",
    endDate: null,
  },
  {
    id: "4",
    userId: "4",
    shiftId: "1",
    startDate: "2023-01-01",
    endDate: null,
  },
  {
    id: "5",
    userId: "5",
    shiftId: "1",
    startDate: "2023-01-01",
    endDate: null,
  },
]

export const payrollRecords = [
  {
    id: "1",
    userId: "1",
    month: "May",
    year: 2023,
    basicSalary: 5000,
    allowances: 500,
    deductions: 1000,
    netSalary: 4500,
    status: "paid",
  },
  {
    id: "2",
    userId: "1",
    month: "April",
    year: 2023,
    basicSalary: 5000,
    allowances: 500,
    deductions: 1000,
    netSalary: 4500,
    status: "paid",
  },
  {
    id: "3",
    userId: "2",
    month: "May",
    year: 2023,
    basicSalary: 7000,
    allowances: 700,
    deductions: 1400,
    netSalary: 6300,
    status: "paid",
  },
  {
    id: "4",
    userId: "2",
    month: "April",
    year: 2023,
    basicSalary: 7000,
    allowances: 700,
    deductions: 1400,
    netSalary: 6300,
    status: "paid",
  },
  {
    id: "5",
    userId: "3",
    month: "May",
    year: 2023,
    basicSalary: 4500,
    allowances: 450,
    deductions: 900,
    netSalary: 4050,
    status: "processed",
  },
]

export const dashboardStats = {
  totalEmployees: 55,
  presentToday: 48,
  pendingLeaves: 5,
  departmentDistribution: [
    { department: "Engineering", count: 20 },
    { department: "Marketing", count: 8 },
    { department: "Sales", count: 12 },
    { department: "HR", count: 5 },
    { department: "Finance", count: 6 },
    { department: "Operations", count: 4 },
  ],
  attendanceTrend: [
    { date: "2023-05-01", present: 45, late: 5, absent: 5 },
    { date: "2023-05-02", present: 48, late: 3, absent: 4 },
    { date: "2023-05-03", present: 47, late: 4, absent: 4 },
    { date: "2023-05-04", present: 50, late: 2, absent: 3 },
    { date: "2023-05-05", present: 49, late: 3, absent: 3 },
    { date: "2023-05-06", present: 40, late: 2, absent: 13 },
    { date: "2023-05-07", present: 38, late: 2, absent: 15 },
  ],
  upcomingBirthdays: [
    { id: "1", date: "2023-05-15" },
    { id: "3", date: "2023-05-22" },
    { id: "5", date: "2023-06-05" },
  ],
  leavesTaken: [
    { month: "January", count: 8 },
    { month: "February", count: 6 },
    { month: "March", count: 9 },
    { month: "April", count: 5 },
    { month: "May", count: 7 },
  ],
}
