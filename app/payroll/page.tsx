"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { payrollRecords, getUserById, hasPermission } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { BanknoteIcon, Download, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function PayrollPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState("May")
  const [selectedYear, setSelectedYear] = useState("2023")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  const canProcessPayroll = hasPermission(user.role, "payroll", "process")

  // Filter payroll records based on user role
  const filteredPayroll = payrollRecords
    .filter((record) => {
      if (user.role === "super_admin" || user.role === "admin" || user.role === "finance") {
        return true // See all records
      } else if (user.role === "manager") {
        // See records of team members and self
        const recordUser = getUserById(record.userId)
        return recordUser?.manager === user.id || record.userId === user.id
      } else {
        // Employee can only see their own records
        return record.userId === user.id
      }
    })
    .filter((record) => record.month === selectedMonth && record.year.toString() === selectedYear)

  const handleProcessPayroll = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Payroll processed!")
    setIsDialogOpen(false)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
            <p className="text-muted-foreground">Manage employee compensation and payroll processing.</p>
          </div>
          {canProcessPayroll && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <BanknoteIcon className="mr-2 h-4 w-4" />
                  Process Payroll
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleProcessPayroll}>
                  <DialogHeader>
                    <DialogTitle>Process Payroll</DialogTitle>
                    <DialogDescription>Generate payroll for the selected period.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="month">Month</Label>
                        <Select defaultValue="May" required>
                          <SelectTrigger id="month">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "January",
                              "February",
                              "March",
                              "April",
                              "May",
                              "June",
                              "July",
                              "August",
                              "September",
                              "October",
                              "November",
                              "December",
                            ].map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="year">Year</Label>
                        <Select defaultValue="2023" required>
                          <SelectTrigger id="year">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {["2023", "2024"].map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="payment-date">Payment Date</Label>
                      <Input id="payment-date" type="date" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Process</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Payroll Records</CardTitle>
                <CardDescription>View and manage employee payroll records</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {["2023", "2024"].map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="my-payroll">
              <TabsList>
                <TabsTrigger value="my-payroll">My Payroll</TabsTrigger>
                {(user.role === "super_admin" ||
                  user.role === "admin" ||
                  user.role === "manager" ||
                  user.role === "finance") && <TabsTrigger value="team-payroll">Team Payroll</TabsTrigger>}
              </TabsList>

              <TabsContent value="my-payroll" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayroll
                      .filter((record) => record.userId === user.id)
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.month} {record.year}
                          </TableCell>
                          <TableCell>${record.basicSalary.toLocaleString()}</TableCell>
                          <TableCell>${record.allowances.toLocaleString()}</TableCell>
                          <TableCell>${record.deductions.toLocaleString()}</TableCell>
                          <TableCell className="font-medium">${record.netSalary.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.status === "paid"
                                  ? "default"
                                  : record.status === "processed"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Slip
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {(user.role === "super_admin" ||
                user.role === "admin" ||
                user.role === "manager" ||
                user.role === "finance") && (
                <TabsContent value="team-payroll" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Basic Salary</TableHead>
                        <TableHead>Net Salary</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayroll
                        .filter((record) => record.userId !== user.id)
                        .map((record) => {
                          const employee = getUserById(record.userId)
                          return (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">{employee?.name || "Unknown"}</TableCell>
                              <TableCell>{employee?.department || "Unknown"}</TableCell>
                              <TableCell>
                                {record.month} {record.year}
                              </TableCell>
                              <TableCell>${record.basicSalary.toLocaleString()}</TableCell>
                              <TableCell className="font-medium">${record.netSalary.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    record.status === "paid"
                                      ? "default"
                                      : record.status === "processed"
                                        ? "outline"
                                        : "secondary"
                                  }
                                >
                                  {record.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <FileText className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Button>
                                  {canProcessPayroll && record.status === "processed" && (
                                    <Button variant="ghost" size="sm">
                                      <BanknoteIcon className="h-4 w-4" />
                                      <span className="sr-only">Pay</span>
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
