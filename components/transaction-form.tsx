"use client"

import type React from "react"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import type { Transaction } from "@/types"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TransactionFormProps {
  transaction?: Transaction | null
  onComplete: () => void
}

export function TransactionForm({ transaction, onComplete }: TransactionFormProps) {
  const { addTransaction, updateTransaction, categories } = useAppContext()

  const [formData, setFormData] = useState<Partial<Transaction>>(
    transaction || {
      type: "expense",
      amount: 0,
      category: "",
      date: new Date().toISOString(),
      description: "",
      paymentMethod: "Card",
    },
  )

  const [errors, setErrors] = useState<{
    amount?: string
    category?: string
    description?: string
  }>({})

  const handleChange = (field: keyof Transaction, value: any) => {
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

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.description) {
      newErrors.description = "Description is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit form
    if (transaction) {
      updateTransaction(transaction.id, formData as Transaction)
    } else {
      addTransaction({
        ...formData,
        id: uuidv4(),
      } as Transaction)
    }

    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Transaction Type</Label>
        <div className="flex gap-4">
          <Label
            htmlFor="type-income"
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-md border p-3 ${
              formData.type === "income" ? "border-primary bg-primary text-primary-foreground" : "border-input"
            }`}
          >
            <input
              type="radio"
              id="type-income"
              name="type"
              className="sr-only"
              checked={formData.type === "income"}
              onChange={() => handleChange("type", "income")}
            />
            Income
          </Label>
          <Label
            htmlFor="type-expense"
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-md border p-3 ${
              formData.type === "expense" ? "border-primary bg-primary text-primary-foreground" : "border-input"
            }`}
          >
            <input
              type="radio"
              id="type-expense"
              name="type"
              className="sr-only"
              checked={formData.type === "expense"}
              onChange={() => handleChange("type", "expense")}
            />
            Expense
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.amount || ""}
          onChange={(e) => handleChange("amount", Number.parseFloat(e.target.value) || 0)}
        />
        {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter((c) =>
                formData.type === "income"
                  ? ["Ride Income", "Tips"].includes(c.name)
                  : !["Ride Income", "Tips"].includes(c.name),
              )
              .map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? format(new Date(formData.date), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.date ? new Date(formData.date) : undefined}
              onSelect={(date) => handleChange("date", date ? date.toISOString() : new Date().toISOString())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter description"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select value={formData.paymentMethod} onValueChange={(value) => handleChange("paymentMethod", value)}>
          <SelectTrigger id="paymentMethod">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">{transaction ? "Update" : "Add"} Transaction</Button>
      </div>
    </form>
  )
}

