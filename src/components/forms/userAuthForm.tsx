"use client"

import { useState } from "react"
import { Button } from "@/ui/button"
import { signIn } from "next-auth/react"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

import { Icons } from "../util/icons"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      await signIn("google")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging in with Google",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        type="button"
        size="sm"
        className="w-full"
        onClick={() => void handleSubmit()}
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  )
}