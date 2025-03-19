"use client"

import { useAppContext } from "@/context/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SummaryCards } from "@/components/summary-cards"
import { IncomeExpenseChart } from "@/components/income-expense-chart"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { RecentTransactions } from "@/components/recent-transactions"
import { BudgetOverview } from "@/components/budget-overview"

export function DashboardPage() {
  const { transactions, totalEarnings, totalExpenses, netSavings, getTransactionsByPeriod } = useAppContext()

  return (
    <div className="space-y-6">
      <Tabs defaultValue="month" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="day" className="space-y-6">
          <SummaryCards period="day" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Today&apos;s financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeExpenseChart period="day" />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Today&apos;s spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown period="day" />
              </CardContent>
            </Card>
          </div>
          <RecentTransactions period="day" />
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <SummaryCards period="week" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>This week&apos;s financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeExpenseChart period="week" />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>This week&apos;s spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown period="week" />
              </CardContent>
            </Card>
          </div>
          <RecentTransactions period="week" />
        </TabsContent>

        <TabsContent value="month" className="space-y-6">
          <SummaryCards period="month" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>This month&apos;s financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeExpenseChart period="month" />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>This month&apos;s spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown period="month" />
              </CardContent>
            </Card>
          </div>
          <BudgetOverview />
          <RecentTransactions period="month" />
        </TabsContent>

        <TabsContent value="year" className="space-y-6">
          <SummaryCards period="year" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>This year&apos;s financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeExpenseChart period="year" />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>This year&apos;s spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown period="year" />
              </CardContent>
            </Card>
          </div>
          <RecentTransactions period="year" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

