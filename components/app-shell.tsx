"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, DollarSign, FileText, Home, Menu, Settings, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Budget",
    href: "/budget",
    icon: DollarSign,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {isMobile ? (
        <>
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px] pr-0">
                <div className="px-2 py-4">
                  <div className="flex items-center justify-between mb-8">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 font-semibold"
                      onClick={() => setOpen(false)}
                    >
                      <BarChart3 className="h-6 w-6 text-primary" />
                      <span>Driver Tracker</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                          pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-8 w-8 rounded-full bg-muted p-1" />
                      <div>
                        <p className="text-sm font-medium">John Driver</p>
                        <p className="text-xs text-muted-foreground">john@example.com</p>
                      </div>
                    </div>
                    <ModeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span>Driver Tracker</span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </>
      ) : (
        <SidebarProvider>
          <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
            <Sidebar>
              <SidebarHeader className="flex h-14 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <span>Driver Tracker</span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="border-t p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-8 w-8 rounded-full bg-muted p-1" />
                    <div>
                      <p className="text-sm font-medium">John Driver</p>
                      <p className="text-xs text-muted-foreground">john@example.com</p>
                    </div>
                  </div>
                  <ModeToggle />
                </div>
              </SidebarFooter>
            </Sidebar>
            <div className="flex flex-col">
              <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
                <SidebarTrigger />
                <div className="font-semibold">
                  {navItems.find((item) => item.href === pathname)?.title || "Dashboard"}
                </div>
              </header>
              <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      )}
    </div>
  )
}

