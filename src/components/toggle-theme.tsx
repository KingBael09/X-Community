"use client"

import { Button, type ButtonProps } from "@/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
import { Icons } from "@/util/icons"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeToggle({ className, ...props }: ButtonProps) {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(className)}
      {...props}
    >
      <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function ThemeDropdown() {
  const { setTheme, theme } = useTheme()

  return (
    <Select
      value={theme}
      onValueChange={() => setTheme(theme === "light" ? "dark" : "light")}
      defaultValue="dark"
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="light">Light</SelectItem>
      </SelectContent>
    </Select>
  )
}
