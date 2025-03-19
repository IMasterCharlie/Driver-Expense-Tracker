import type { Transaction, Budget, Category } from "@/types"
import { v4 as uuidv4 } from "uuid"

export function generateMockData() {
  const categories: Category[] = [
    { id: "cat-1", name: "Fuel", icon: "Fuel", color: "#FF5733" },
    { id: "cat-2", name: "Maintenance", icon: "Tool", color: "#33A1FF" },
    { id: "cat-3", name: "Insurance", icon: "Shield", color: "#33FF57" },
    { id: "cat-4", name: "Food", icon: "Utensils", color: "#FF33A1" },
    { id: "cat-5", name: "Ride Income", icon: "Car", color: "#A133FF" },
    { id: "cat-6", name: "Tips", icon: "DollarSign", color: "#FFFF33" },
    { id: "cat-7", name: "Tolls", icon: "Road", color: "#33FFF1" },
    { id: "cat-8", name: "Car Wash", icon: "Droplet", color: "#FF8333" },
  ]

  const budgets: Budget[] = [
    { id: "budget-1", category: "Fuel", limit: 200, period: "month" },
    { id: "budget-2", category: "Maintenance", limit: 150, period: "month" },
    { id: "budget-3", category: "Food", limit: 100, period: "month" },
    { id: "budget-4", category: "Tolls", limit: 50, period: "month" },
    { id: "budget-5", category: "Car Wash", limit: 30, period: "month" },
  ]

  // Generate transactions for the last 30 days
  const transactions: Transaction[] = []
  const now = new Date()

  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)

    // Add income transactions (1-2 per day)
    const incomeCount = Math.floor(Math.random() * 2) + 1
    for (let j = 0; j < incomeCount; j++) {
      const amount = Math.floor(Math.random() * 100) + 50
      transactions.push({
        id: uuidv4(),
        type: "income",
        amount,
        category: Math.random() > 0.3 ? "Ride Income" : "Tips",
        date: date.toISOString(),
        description: Math.random() > 0.3 ? "Ride earnings" : "Customer tip",
        paymentMethod: Math.random() > 0.5 ? "Cash" : "Card",
      })
    }

    // Add expense transactions (0-3 per day)
    const expenseCount = Math.floor(Math.random() * 4)
    for (let j = 0; j < expenseCount; j++) {
      const expenseCategories = ["Fuel", "Maintenance", "Food", "Tolls", "Car Wash"]
      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)]

      let amount
      switch (category) {
        case "Fuel":
          amount = Math.floor(Math.random() * 30) + 20
          break
        case "Maintenance":
          amount = Math.floor(Math.random() * 50) + 30
          break
        case "Food":
          amount = Math.floor(Math.random() * 15) + 5
          break
        case "Tolls":
          amount = Math.floor(Math.random() * 10) + 2
          break
        case "Car Wash":
          amount = Math.floor(Math.random() * 10) + 5
          break
        default:
          amount = Math.floor(Math.random() * 20) + 10
      }

      transactions.push({
        id: uuidv4(),
        type: "expense",
        amount,
        category,
        date: date.toISOString(),
        description: `${category} expense`,
        paymentMethod: Math.random() > 0.7 ? "Cash" : "Card",
      })
    }
  }

  return {
    transactions,
    budgets,
    categories,
  }
}

