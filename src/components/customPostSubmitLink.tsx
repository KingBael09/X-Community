"use client"

import type { Route } from "next"
import Link, { type LinkRestProps } from "next/link"
import { usePathname } from "next/navigation"

export function PostSubmitLink({ children, ...props }: LinkRestProps) {
  const pathname = usePathname()

  return (
    <Link href={`${pathname}/submit` as Route} {...props}>
      {children}
    </Link>
  )
}
