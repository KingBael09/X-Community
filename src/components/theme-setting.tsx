import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"

import { cn } from "@/lib/utils"

import { ThemeDropdown } from "./toggle-theme"

type Props = React.HTMLAttributes<HTMLDivElement>

export function ThemeSetting({ className, ...props }: Props) {
  return (
    <Card className={cn("flex items-center", className)} {...props}>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>Chose a theme</CardDescription>
      </CardHeader>
      <CardContent className="ml-auto p-0 pr-6">
        <ThemeDropdown />
      </CardContent>
    </Card>
  )
}
