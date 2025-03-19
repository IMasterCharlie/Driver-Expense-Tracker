"use client"

import { useAppContext } from "@/context/app-context"
import { formatCurrency } from "@/lib/utils"
import type { TimeRange } from "@/types"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export function CategoryBreakdown({ period }: { period: TimeRange }) {
  const { getTransactionsByPeriod, categories } = useAppContext()

  const transactions = getTransactionsByPeriod(period)

  // Calculate totals by category
  const categoryTotals: { [key: string]: number } = {}

  transactions
    .filter((t) => t.type === "expense")
    .forEach((transaction) => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0
      }
      categoryTotals[transaction.category] += transaction.amount
    })

  // Convert to array for chart
  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }))

  // Get colors from categories
  const categoryColors: { [key: string]: string } = {}
  categories.forEach((category) => {
    categoryColors[category.name] = category.color
  })

  // If no data, show message
  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No expense data for this period</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || `hsl(${index * 45}, 70%, 50%)`} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [formatCurrency(value as number), undefined]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

