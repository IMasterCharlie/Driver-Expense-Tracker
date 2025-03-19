"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Transaction, Budget, Category } from "@/types"
import { generateMockData } from "@/lib/mock-data"

type AppContextType = {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Transaction) => void
  deleteTransaction: (id: string) => void
  budgets: Budget[]
  updateBudget: (id: string, budget: Budget) => void
  categories: Category[]
  addCategory: (category: Category) => void
  updateCategory: (id: string, category: Category) => void
  deleteCategory: (id: string) => void
  totalEarnings: number
  totalExpenses: number
  netSavings: number
  getTransactionsByPeriod: (period: "day" | "week" | "month" | "year") => Transaction[]
  getCategoryTotals: () => { [key: string]: number }
  getBudgetUtilization: () => { [key: string]: number }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("driverTrackerData")
      if (savedData) {
        return JSON.parse(savedData)
      }
    }
    return generateMockData()
  })

  const { transactions, budgets, categories } = data

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("driverTrackerData", JSON.stringify(data))
    }
  }, [data])

  const addTransaction = (transaction: Transaction) => {
    setData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, transaction],
    }))
  }

  const updateTransaction = (id: string, transaction: Transaction) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === id ? { ...transaction, id } : t)),
    }))
  }

  const deleteTransaction = (id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }))
  }

  const updateBudget = (id: string, budget: Budget) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) => (b.id === id ? { ...budget, id } : b)),
    }))
  }

  const addCategory = (category: Category) => {
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, category],
    }))
  }

  const updateCategory = (id: string, category: Category) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...category, id } : c)),
    }))
  }

  const deleteCategory = (id: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }))
  }

  const totalEarnings = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const netSavings = totalEarnings - totalExpenses

  const getTransactionsByPeriod = (period: "day" | "week" | "month" | "year") => {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "day":
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case "week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - now.getDay())
        startDate.setHours(0, 0, 0, 0)
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(0)
    }

    return transactions.filter((t) => new Date(t.date) >= startDate)
  }

  const getCategoryTotals = () => {
    const totals: { [key: string]: number } = {}

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (!totals[t.category]) {
          totals[t.category] = 0
        }
        totals[t.category] += t.amount
      })

    return totals
  }

  const getBudgetUtilization = () => {
    const categoryTotals = getCategoryTotals()
    const utilization: { [key: string]: number } = {}

    budgets.forEach((budget) => {
      const spent = categoryTotals[budget.category] || 0
      utilization[budget.category] = (spent / budget.limit) * 100
    })

    return utilization
  }

  return (
    <AppContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budgets,
        updateBudget,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        totalEarnings,
        totalExpenses,
        netSavings,
        getTransactionsByPeriod,
        getCategoryTotals,
        getBudgetUtilization,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

