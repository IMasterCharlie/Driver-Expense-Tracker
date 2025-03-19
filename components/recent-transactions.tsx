"use client"

import { useAppContext } from "@/context/app-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { TimeRange } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

export function RecentTransactions({ period }: { period: TimeRange }) {
  const { getTransactionsByPeriod } = useAppContext()

  const transactions = getTransactionsByPeriod(period)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No transactions for this period</p>
        ) : (
          <div className="space-y-8">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  {transaction.type === "income" ? (
                    <ArrowUpIcon className="h-4 w-4 text-secondary" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
                <div
                  className={`ml-auto font-medium ${transaction.type === "income" ? "text-secondary" : "text-primary"}`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

