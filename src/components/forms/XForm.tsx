"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { createCommunityAction } from "@/actions/community"
import { Button } from "@/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { XFormSchema, type ZForm } from "@/lib/validators/community"
import { toast } from "@/hooks/use-toast"

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

export function CommunityCreateForm() {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const form = useForm<ZForm>({
    resolver: zodResolver(XFormSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit({ name }: ZForm) {
    startTransition(async () => {
      try {
        const res = await createCommunityAction({ name })
        form.reset()
        toast({
          title: "Success",
          description: (
            <span>
              Community <span className="font-bold">x/{res.name}</span>{" "}
              created!!
            </span>
          ),
        })
        router.push(`/x/${res.name}`)
      } catch (e) {
        toast({
          title: "Error",
          description: e instanceof Error ? e.message : "Something went wrong",
          variant: "destructive",
        })
      }
    })
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
            disabled={isPending}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
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
