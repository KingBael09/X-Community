"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { commentPostAction } from "@/app/_actions/post"

import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Textarea } from "./ui/textarea"
import { Icons } from "./util/icons"

const CommentSchema = z.object({
  postId: z.string(),
  comment: z
    .string()
    .min(1, { message: "Comments should be atleast one character long" }),
  replyToId: z.string().optional(),
})

export type ZComment = z.infer<typeof CommentSchema>

interface CreateCommentProps {
  postId: string
  replyToId?: string
  isSubComment?: boolean
}

export function CreateComment({
  postId,
  replyToId,
  isSubComment = false,
}: CreateCommentProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<ZComment>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: "",
      postId,
      replyToId,
    },
  })

  function onSubmit(values: ZComment) {
    startTransition(async () => {
      try {
        await commentPostAction(values)
        form.reset()
        router.refresh()
        toast({
          title: "Success",
          description: "Comment posted successfully",
        })
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
    <div className="grid w-full gap-1.5">
      <Form {...form}>
        <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                {!isSubComment && <FormLabel>Your Comment</FormLabel>}
                <FormControl>
                  <Textarea
                    placeholder="What are your throughts?"
                    rows={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" mt-4 flex w-full">
            <Button
              type="submit"
              className="w-full md:ml-auto md:w-fit"
              disabled={isPending}
            >
              {isPending ? (
                <Icons.loading className="h-4 w-4 animate-spin" />
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
