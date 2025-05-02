"use client"

import { NavBar } from "./tubelight-navbar"
import type { LucideIcon } from "lucide-react"

type IconName = "Home" | "User" | "Briefcase" | "FileText" | "DollarSign" | "FileQuestion" | "Users" | "HelpCircle"

export function NavBarDemo() {
  const navItems = [
    { name: 'Use Cases', url: '#', iconName: 'FileQuestion' as IconName },
    { name: 'Pricing', url: '#', iconName: 'DollarSign' as IconName },
    { name: 'Manifesto', url: '#', iconName: 'FileText' as IconName },
    { name: 'Careers', url: '#', iconName: 'Users' as IconName },
    { name: 'Help Center', url: '#', iconName: 'HelpCircle' as IconName }
  ]

  return <NavBar items={navItems} />
} 