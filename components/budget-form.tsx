"use client"

import type React from "react"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import type { Budget } from "@/types"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BudgetFormProps {
  budget?: Budget | null
  onComplete: () => void
}

export function BudgetForm({ budget, onComplete }: BudgetFormProps) {
  const { budgets, updateBudget, categories } = useAppContext()

  const [formData, setFormData] = useState<Partial<Budget>>(
    budget || {
      category: "",
      limit: 0,
      period: "month",
    },
  )

  const [errors, setErrors] = useState<{
    category?: string
    limit?: string
  }>({})

  // Filter out categories that already have budgets
  const availableCategories = categories.filter(
    (c) =>
      !["Ride Income", "Tips"].includes(c.name) && // Exclude income categories
      (budget?.category === c.name || // Include current category if editing
        !budgets.some((b) => b.category === c.name)), // Exclude categories with budgets
  )

  const handleChange = (field: keyof Budget, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when field is updated
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: typeof errors = {}

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.limit || formData.limit <= 0) {
      newErrors.limit = "Budget limit must be greater than 0"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit form
    if (budget) {
      updateBudget(budget.id, formData as Budget)
    } else {
      const newBudget: Budget = {
        ...formData,
        id: uuidv4(),
      } as Budget

      updateBudget(newBudget.id, newBudget)
    }

    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleChange("category", value)}
          disabled={!!budget} // Disable if editing
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="limit">Monthly Budget Limit</Label>
        <Input
          id="limit"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.limit || ""}
          onChange={(e) => handleChange("limit", Number.parseFloat(e.target.value) || 0)}
        />
        {errors.limit && <p className="text-sm text-destructive">{errors.limit}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">{budget ? "Update" : "Set"} Budget</Button>
      </div>
    </form>
  )
}

