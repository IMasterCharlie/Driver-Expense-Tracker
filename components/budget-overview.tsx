"use client"

import { useAppContext } from "@/context/app-context"
import { formatCurrency, getPercentageColor } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function BudgetOverview() {
  const { budgets, getCategoryTotals } = useAppContext()

  const categoryTotals = getCategoryTotals()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Track your spending against monthly budgets</CardDescription>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No budgets set</p>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent = categoryTotals[budget.category] || 0
              const percentage = Math.min(Math.round((spent / budget.limit) * 100), 100)
              const remaining = Math.max(budget.limit - spent, 0)

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{budget.category}</p>
                      <p className={`text-xs ${getPercentageColor(percentage)}`}>
                        {formatCurrency(spent)} of {formatCurrency(budget.limit)} ({percentage}%)
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(remaining)} remaining</div>
                  </div>
                  <Progress
                    value={percentage}
                    className={`${
                      percentage >= 75 ? "bg-muted" : ""
                    } ${percentage < 50 ? "bg-secondary" : percentage < 75 ? "bg-warning" : "bg-destructive"}`}
                  />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

