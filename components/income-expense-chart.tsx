"use client"

import { useAppContext } from "@/context/app-context"
import { formatCurrency } from "@/lib/utils"
import type { TimeRange } from "@/types"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function IncomeExpenseChart({ period }: { period: TimeRange }) {
  const { getTransactionsByPeriod } = useAppContext()

  const transactions = getTransactionsByPeriod(period)

  // Group transactions by date
  const groupedData: { [key: string]: { date: string; income: number; expense: number } } = {}

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date)
    let dateKey: string

    switch (period) {
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

    if (!groupedData[dateKey]) {
      groupedData[dateKey] = { date: dateKey, income: 0, expense: 0 }
    }

    if (transaction.type === "income") {
      groupedData[dateKey].income += transaction.amount
    } else {
      groupedData[dateKey].expense += transaction.amount
    }
  })

  // Convert to array and sort
  let chartData = Object.values(groupedData)

  if (period === "day") {
    // For day view, ensure all hours are represented
    const hourData: { [key: string]: { date: string; income: number; expense: number } } = {}
    for (let i = 0; i < 24; i++) {
      const hourKey = `${i}:00`
      hourData[hourKey] = groupedData[hourKey] || { date: hourKey, income: 0, expense: 0 }
    }
    chartData = Object.values(hourData).sort((a, b) => Number.parseInt(a.date) - Number.parseInt(b.date))
  } else if (period === "week") {
    // For week view, ensure all days are represented in order
    const dayOrder = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
    chartData = chartData.sort(
      (a, b) => dayOrder[a.date as keyof typeof dayOrder] - dayOrder[b.date as keyof typeof dayOrder],
    )
  } else if (period === "month") {
    // For month view, sort by day number
    chartData = chartData.sort((a, b) => Number.parseInt(a.date) - Number.parseInt(b.date))
  } else if (period === "year") {
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

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(value) => [`${formatCurrency(value as number)}`, undefined]} />
          <Legend />
          <Area
            type="monotone"
            dataKey="income"
            stroke="hsl(var(--secondary))"
            fillOpacity={1}
            fill="url(#colorIncome)"
            name="Income"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorExpense)"
            name="Expense"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

