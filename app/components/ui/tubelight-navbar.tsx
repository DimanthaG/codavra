"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"

type IconName = "Home" | "User" | "Briefcase" | "FileText" | "DollarSign" | "FileQuestion" | "Users" | "HelpCircle"

interface NavItem {
  name: string
  url: string
  iconName: IconName
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-transparent",
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold">
            Codavra
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => {
              const Icon = Icons[item.iconName]
              const isActive = activeTab === item.name

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative text-sm font-medium transition-colors",
                    "text-gray-300 hover:text-white",
                    isActive && "text-white"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={16} />
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-4 py-2 rounded-full bg-white text-blue-900 hover:bg-gray-100 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-900/80 backdrop-blur-lg border-t border-white/10">
        <div className="flex items-center justify-around py-3">
          {items.map((item) => {
            const Icon = Icons[item.iconName]
            const isActive = activeTab === item.name

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "flex flex-col items-center gap-1",
                  "text-gray-300 hover:text-white",
                  isActive && "text-white"
                )}
              >
                <Icon size={20} />
                <span className="text-xs">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 