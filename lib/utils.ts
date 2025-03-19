import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function getPercentageColor(percentage: number): string {
  if (percentage < 50) return "text-secondary"
  if (percentage < 75) return "text-warning"
  return "text-destructive"
}

export function getRandomColor(): string {
  const colors = ["#FF5733", "#33A1FF", "#33FF57", "#FF33A1", "#A133FF", "#FFFF33", "#33FFF1", "#FF8333"]
  return colors[Math.floor(Math.random() * colors.length)]
}

