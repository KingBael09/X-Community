"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { changeUsernameAction } from "@/actions/user"
import { Button } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/form"
import { Input } from "@/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { UserNameFormSchema, type ZUser } from "@/lib/validators/user"
import { toast } from "@/hooks/use-toast"
import { Icons } from "@/components/util/icons"

interface UserNameFormProps {
  username?: string | null
}

export function UserNameForm({ username }: UserNameFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<ZUser>({
    resolver: zodResolver(UserNameFormSchema),
    defaultValues: {
      name: username ?? "",
    },
  })

  function onSubmit(values: ZUser) {
    startTransition(async () => {
      try {
        await changeUsernameAction(values)
        toast({
          title: "Success",
          description: "Username changed successfully",
        })
        router.refresh()
      } catch (e) {
        toast({
          title: "Error",
          description: e instanceof Error ? e.message : "Something went wrong",
        })
        form.reset()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
        <Card>
          <CardHeader>
            <CardTitle>Your Username</CardTitle>
            <CardDescription>
              Please enter a display name you are comfortable with
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="relative flex items-center">
                    <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-muted-foreground">
                      u/
                    </p>
                    <FormControl>
                      <Input className="pl-6" {...field} />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full md:w-fit"
              disabled={isPending}
            >
              {isPending ? (
                <Icons.loading className="h-4 w-4 animate-spin" />
              ) : (
                "Change Name"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
