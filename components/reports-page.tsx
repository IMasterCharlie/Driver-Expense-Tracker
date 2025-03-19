"use client"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { TimeRange } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download } from "lucide-react"

export function ReportsPage() {
  const { transactions, getTransactionsByPeriod, getCategoryTotals, categories } = useAppContext()

  const [selectedPeriod, setSelectedPeriod] = useState<TimeRange>("month")

  const periodTransactions = getTransactionsByPeriod(selectedPeriod)
  const categoryTotals = getCategoryTotals()

  // Prepare data for category breakdown chart
  const categoryData = Object.entries(categoryTotals)
    .filter(([category]) => !["Ride Income", "Tips"].includes(category))
    .map(([name, value]) => ({
      name,
      value,
    }))

  // Get colors from categories
  const categoryColors: { [key: string]: string } = {}
  categories.forEach((category) => {
    categoryColors[category.name] = category.color
  })

  // Prepare data for income vs expenses trend
  const trendData: { [key: string]: { date: string; income: number; expense: number } } = {}

  periodTransactions.forEach((transaction) => {
    const date = new Date(transaction.date)
    let dateKey: string

    switch (selectedPeriod) {
      case "day":
        dateKey = `${date.getHours()}:00`
        break
      case "week":
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        dateKey = days[date.getDay()]
        break
      case "month":
        dateKey = date.getDate().toString()
        break
      case "year":
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        dateKey = months[date.getMonth()]
        break
      default:
        dateKey = date.toISOString().split("T")[0]
    }

    if (!trendData[dateKey]) {
      trendData[dateKey] = { date: dateKey, income: 0, expense: 0 }
    }

    if (transaction.type === "income") {
      trendData[dateKey].income += transaction.amount
    } else {
      trendData[dateKey].expense += transaction.amount
    }
  })

  // Convert to array and sort
  let chartData = Object.values(trendData)

  if (selectedPeriod === "day") {
    // For day view, ensure all hours are represented
    const hourData: { [key: string]: { date: string; income: number; expense: number } } = {}
    for (let i = 0; i < 24; i++) {
      const hourKey = `${i}:00`
      hourData[hourKey] = trendData[hourKey] || { date: hourKey, income: 0, expense: 0 }
    }
    chartData = Object.values(hourData).sort((a, b) => Number.parseInt(a.date) - Number.parseInt(b.date))
  } else if (selectedPeriod === "week") {
    // For week view, ensure all days are represented in order
    const dayOrder = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
    chartData = chartData.sort(
      (a, b) => dayOrder[a.date as keyof typeof dayOrder] - dayOrder[b.date as keyof typeof dayOrder],
    )
  } else if (selectedPeriod === "month") {
    // For month view, sort by day number
    chartData = chartData.sort((a, b) => Number.parseInt(a.date) - Number.parseInt(b.date))
  } else if (selectedPeriod === "year") {
    // For year view, ensure all months are represented in order
    const monthOrder = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    }
    chartData = chartData.sort(
      (a, b) => monthOrder[a.date as keyof typeof monthOrder] - monthOrder[b.date as keyof typeof monthOrder],
    )
  }

  // Prepare data for payment method breakdown
  const paymentMethodData = periodTransactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "expense") {
        const method = transaction.paymentMethod
        if (!acc[method]) {
          acc[method] = 0
        }
        acc[method] += transaction.amount
      }
      return acc
    },
    {} as { [key: string]: number },
  )

  const paymentMethodChartData = Object.entries(paymentMethodData).map(([name, value]) => ({
    name,
    value,
  }))

  // Handle export report
  const handleExportReport = () => {
    // Create CSV content
    const headers = ["Date", "Type", "Category", "Amount", "Description", "Payment Method"]
    const csvContent = [
      headers.join(","),
      ...periodTransactions.map((t) =>
        [
          formatDate(t.date),
          t.type,
          t.category,
          t.amount,
          `"${t.description.replace(/"/g, '""')}"`,
          t.paymentMethod,
        ].join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `financial-report-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Tabs
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value as TimeRange)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses Trend</CardTitle>
            <CardDescription>
              {selectedPeriod === "day" && "Today's financial activity by hour"}
              {selectedPeriod === "week" && "This week's financial activity by day"}
              {selectedPeriod === "month" && "This month's financial activity by day"}
              {selectedPeriod === "year" && "This year's financial activity by month"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`${formatCurrency(value as number)}`, undefined]} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="hsl(var(--secondary))" name="Income" strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="hsl(var(--primary))" name="Expense" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Breakdown of expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {categoryData.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No expense data for this period</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={categoryColors[entry.name] || `hsl(${index * 45}, 70%, 50%)`}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(value as number), undefined]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Breakdown of expenses by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {paymentMethodChartData.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No expense data for this period</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentMethodChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), undefined]} />
                    <Legend />
                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Amount" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Key metrics for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-secondary">
                    {formatCurrency(
                      periodTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(
                      periodTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Net Savings</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      periodTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0) -
                        periodTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Savings Rate</p>
                  <p className="text-2xl font-bold">
                    {(() => {
                      const income = periodTransactions
                        .filter((t) => t.type === "income")
                        .reduce((sum, t) => sum + t.amount, 0)
                      const expenses = periodTransactions
                        .filter((t) => t.type === "expense")
                        .reduce((sum, t) => sum + t.amount, 0)

                      if (income === 0) return "0%"

                      const savingsRate = ((income - expenses) / income) * 100
                      return `${savingsRate.toFixed(1)}%`
                    })()}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Top Expense Categories</h3>
                <div className="space-y-2">
                  {categoryData
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3)
                    .map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-sm">{category.name}</p>
                        <p className="text-sm font-medium">{formatCurrency(category.value)}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Download detailed financial reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">Monthly Financial Statement</h3>
                <p className="text-sm text-muted-foreground">Complete breakdown of income, expenses, and savings</p>
              </div>
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">Category Analysis Report</h3>
                <p className="text-sm text-muted-foreground">Detailed analysis of spending by category</p>
              </div>
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Tax Summary Report</h3>
                <p className="text-sm text-muted-foreground">Summary of income and expenses for tax purposes</p>
              </div>
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

