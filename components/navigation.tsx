"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Gift, Users, User, MessageCircle, Sparkles, Heart, Menu, X, Settings, LogOut } from "lucide-react"
import { LanguageSelector } from "./language-selector"

const workspaceItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/learn", label: "Learning Modules", icon: BookOpen },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/community", label: "Community", icon: Users },
  { href: "/tutor", label: "WhatsApp Tutor", icon: MessageCircle },
  { href: "/dreamland", label: "Dreamland", icon: Sparkles },
  { href: "/wellness", label: "Mental Health Hub", icon: Heart },
]

const accountItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { logout, userProfile, currentUser } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">EduFeed</span>
              {currentUser?.isAnonymous && (
                <span className="text-xs text-muted-foreground">Guest Mode</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t bg-background">
            <nav className="grid grid-cols-2 gap-2 p-4">
              {[...workspaceItems, ...accountItems].map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-lg transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#1e5f74] flex-col text-white">
        {/* Header Section */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">EduFeed</h1>
            </div>
          </div>
          <p className="text-sm text-white/80 mb-4">Learning feeds the future</p>
          <LanguageSelector />
        </div>

        {/* Navigation Content */}
        <div className="flex-1 px-4">
          {/* My Workspace Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 mb-3 px-2">My Workspace</h3>
            <nav className="space-y-1">
              {workspaceItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-white",
                      isActive ? "bg-white/10" : "hover:bg-white/5",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* My Account Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 mb-3 px-2">My Account</h3>
            <nav className="space-y-1">
              {accountItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-white",
                      isActive ? "bg-white/10" : "hover:bg-white/5",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-colors text-white hover:bg-white/5"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">
                  {currentUser?.isAnonymous ? "Exit Guest Mode" : "Sign Out"}
                </span>
              </Button>
            </nav>
          </div>
        </div>

        {/* Bottom Student Status */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <User className="h-5 w-5 text-white" />
            <div>
              <div className="font-medium text-white">Student</div>
              <div className="text-sm text-white/70">Level 5 • 1,250 coins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t">
        <nav className="flex justify-around py-2">
          {workspaceItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-0",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
