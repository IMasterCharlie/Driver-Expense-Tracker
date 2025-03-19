export type Transaction = {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  description: string
  paymentMethod: string
}

export type Budget = {
  id: string
  category: string
  limit: number
  period: "day" | "week" | "month" | "year"
}

export type Category = {
  id: string
  name: string
  icon: string
  color: string
}

export type TimeRange = "day" | "week" | "month" | "year"

