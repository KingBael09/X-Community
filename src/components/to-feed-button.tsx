"use client"

import type { Route } from "next"
import Link, { type LinkRestProps } from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/ui/button"
import { Icons } from "@/util/icons"

import { cn } from "@/lib/utils"

export function ToFeedButton({ className, ...props }: LinkRestProps) {
  const pathname = usePathname()

  const communityPath = getCommunityPath(pathname)

  return (
    <Link
      href={communityPath as Route}
      className={cn(buttonVariants({ variant: "ghost" }), className)}
      {...props}
    >
      <Icons.back className="mr-1 h-4 w-4" />
      {communityPath === "/" ? "Back home" : "Back to community"}
    </Link>
  )
}

function getCommunityPath(pathname: string) {
  const splitPath = pathname.split("/")

  if (splitPath.length === 3) return "/"
  else if (splitPath.length > 3)
    return `/${splitPath[1] as string}/${splitPath[2] as string}`
  else return "/"
}
