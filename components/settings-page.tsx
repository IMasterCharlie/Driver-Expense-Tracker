"use client"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import { getRandomColor } from "@/lib/utils"
import type { Category } from "@/types"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { CircleDollarSign, CreditCard, Download, Plus, Trash2, Upload } from "lucide-react"

export function SettingsPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAppContext()
  const { theme, setTheme } = useTheme()

  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    icon: "CircleDollarSign",
    color: getRandomColor(),
  })

  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)

  const handleAddCategory = () => {
    if (!newCategory.name) return

    addCategory({
      ...newCategory,
      id: uuidv4(),
    } as Category)

    setNewCategory({
      name: "",
      icon: "CircleDollarSign",
      color: getRandomColor(),
    })

    setIsAddCategoryDialogOpen(false)
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id)
    }
  }

  const handleExportData = () => {
    // This would normally connect to the backend to export all data
    alert("Data export functionality would be implemented here")
  }

  const handleImportData = () => {
    // This would normally connect to the backend to import data
    alert("Data import functionality would be implemented here")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Driver" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Expense Categories</CardTitle>
                  <CardDescription>Manage your expense categories</CardDescription>
                </div>
                <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add Category</DialogTitle>
                      <DialogDescription>Create a new expense category</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-icon">Icon</Label>
                        <Select
                          value={newCategory.icon}
                          onValueChange={(value) => setNewCategory((prev) => ({ ...prev, icon: value }))}
                        >
                          <SelectTrigger id="category-icon">
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CircleDollarSign">Dollar</SelectItem>
                            <SelectItem value="CreditCard">Credit Card</SelectItem>
                            <SelectItem value="ShoppingCart">Shopping</SelectItem>
                            <SelectItem value="Utensils">Food</SelectItem>
                            <SelectItem value="Car">Car</SelectItem>
                            <SelectItem value="Home">Home</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-color">Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="category-color"
                            type="color"
                            value={newCategory.color}
                            onChange={(e) => setNewCategory((prev) => ({ ...prev, color: e.target.value }))}
                            className="w-12 h-8 p-1"
                          />
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: newCategory.color }} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="button" onClick={handleAddCategory}>
                          Add Category
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {category.icon === "CircleDollarSign" && <CircleDollarSign className="h-4 w-4" />}
                          {category.icon === "CreditCard" && <CreditCard className="h-4 w-4" />}
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: category.color }} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={["Ride Income", "Tips"].includes(category.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the app appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="currency">Currency</Label>
                  <p className="text-sm text-muted-foreground">Set your preferred currency</p>
                </div>
                <Select defaultValue="USD">
                  <SelectTrigger id="currency" className="w-[180px]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="budget-alerts">Budget Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts when you approach budget limits</p>
                </div>
                <Switch id="budget-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-summary">Weekly Summary</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly financial summaries</p>
                </div>
                <Switch id="weekly-summary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="savings-goals">Savings Goals</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about savings goals</p>
                </div>
                <Switch id="savings-goals" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export or import your financial data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Export All Data</h3>
                  <p className="text-sm text-muted-foreground">Download all your financial data as CSV</p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Import Data</h3>
                  <p className="text-sm text-muted-foreground">Import financial data from CSV</p>
                </div>
                <Button variant="outline" onClick={handleImportData}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Delete All Data</h3>
                  <p className="text-sm text-muted-foreground">Remove all your financial data</p>
                </div>
                <Button variant="destructive">Delete All Data</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

