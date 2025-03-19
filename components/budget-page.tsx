"use client"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import { formatCurrency, getPercentageColor } from "@/lib/utils"
import type { Budget } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BudgetForm } from "@/components/budget-form"
import { AlertTriangle, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function BudgetPage() {
  const { budgets, updateBudget, getCategoryTotals, getBudgetUtilization } = useAppContext()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

  const categoryTotals = getCategoryTotals()
  const utilization = getBudgetUtilization()

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setIsAddDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Budget Planner</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingBudget ? "Edit Budget" : "Set Budget"}</DialogTitle>
              <DialogDescription>
                {editingBudget
                  ? "Update your spending limit for this category."
                  : "Set a spending limit for a category."}
              </DialogDescription>
            </DialogHeader>
            <BudgetForm
              budget={editingBudget}
              onComplete={() => {
                setIsAddDialogOpen(false)
                setEditingBudget(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const spent = categoryTotals[budget.category] || 0
          const percentage = Math.min(Math.round((spent / budget.limit) * 100), 100)
          const remaining = Math.max(budget.limit - spent, 0)

          return (
            <Card key={budget.id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {budget.category}
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </Button>
                </CardTitle>
                <CardDescription>Monthly budget: {formatCurrency(budget.limit)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={getPercentageColor(percentage)}>
                      {formatCurrency(spent)} spent ({percentage}%)
                    </div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(remaining)} remaining</div>
                  </div>
                  <Progress
                    value={percentage}
                    className={`h-2 ${
                      percentage < 50 ? "bg-secondary" : percentage < 75 ? "bg-warning" : "bg-destructive"
                    }`}
                  />
                </div>

                {percentage >= 75 && (
                  <Alert variant={percentage >= 100 ? "destructive" : "default"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{percentage >= 100 ? "Budget Exceeded!" : "Budget Alert"}</AlertTitle>
                    <AlertDescription>
                      {percentage >= 100
                        ? "You have exceeded your budget for this category."
                        : `You have used ${percentage}% of your budget for this category.`}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-sm text-muted-foreground">
                  <p>Daily target: {formatCurrency(budget.limit / 30)}</p>
                  <p>Weekly target: {formatCurrency(budget.limit / 4.3)}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {budgets.length === 0 && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No Budgets Set</CardTitle>
              <CardDescription>Set up budgets to track your spending and save more.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4 text-center">
                Setting budgets helps you control spending and reach your financial goals.
              </p>
              <Button
                onClick={() => {
                  setIsAddDialogOpen(true)
                  setEditingBudget(null)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Set Your First Budget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Savings Recommendations</CardTitle>
          <CardDescription>AI-powered suggestions to improve your budget</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Based on your spending patterns, you could save approximately {formatCurrency(75)} per month by reducing
              your food expenses by 15%.
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertDescription>
              Consider washing your car less frequently. Reducing car washes to once every two weeks could save you{" "}
              {formatCurrency(15)} monthly.
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertDescription>
              Try carpooling with other drivers for fuel stops. This could reduce your fuel costs by up to 10%, saving
              approximately {formatCurrency(20)} per month.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

