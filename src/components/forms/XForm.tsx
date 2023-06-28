"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Icons } from "../util/icons"

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Community name must be at least 2 characters.",
    })
    .max(25, {
      message: "Community name must be under 25 characters.",
    })
    .regex(/^[^\s]*$/, {
      message: "No spaces allowed",
    }),
})

type ZForm = z.infer<typeof formSchema>

export function CommunityCreateForm() {
  const router = useRouter()

  const [isLoading, setLoading] = useState(false)

  const form = useForm<ZForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: ZForm) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true)
    console.log(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <div className="relative flex items-center">
                <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-muted-foreground">
                  x/
                </p>
                <FormControl>
                  <Input className="pl-6" placeholder="Technology" {...field} />
                </FormControl>
              </div>
              <FormDescription>
                Community names including capitalization cannot be changed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2 flex items-center gap-4">
          <Button
            variant="outline"
            type="reset"
            disabled={isLoading}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.loading className="h-4 w-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
