"use client"

import { useAppContext } from "@/context/app-context"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import type { TimeRange } from "@/types"

export function SummaryCards({ period }: { period: TimeRange }) {
  const { getTransactionsByPeriod } = useAppContext()

  const transactions = getTransactionsByPeriod(period)

  const totalEarnings = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const netSavings = totalEarnings - totalExpenses

  // Calculate percentage change (mock data for demo)
  const earningsChange = 12.5
  const expensesChange = -5.2
  const savingsChange = 18.3

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
          <p className="text-xs text-muted-foreground">
            {earningsChange > 0 ? (
              <span className="flex items-center text-secondary">
                <ArrowUpIcon className="mr-1 h-4 w-4" />
                {earningsChange}% from previous {period}
              </span>
            ) : (
              <span className="flex items-center text-destructive">
                <ArrowDownIcon className="mr-1 h-4 w-4" />
                {Math.abs(earningsChange)}% from previous {period}
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">
            {expensesChange < 0 ? (
              <span className="flex items-center text-secondary">
                <ArrowDownIcon className="mr-1 h-4 w-4" />
                {Math.abs(expensesChange)}% from previous {period}
              </span>
            ) : (
              <span className="flex items-center text-destructive">
                <ArrowUpIcon className="mr-1 h-4 w-4" />
                {expensesChange}% from previous {period}
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(netSavings)}</div>
          <p className="text-xs text-muted-foreground">
            {savingsChange > 0 ? (
              <span className="flex items-center text-secondary">
                <ArrowUpIcon className="mr-1 h-4 w-4" />
                {savingsChange}% from previous {period}
              </span>
            ) : (
              <span className="flex items-center text-destructive">
                <ArrowDownIcon className="mr-1 h-4 w-4" />
                {Math.abs(savingsChange)}% from previous {period}
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

