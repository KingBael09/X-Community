"use client"

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import "@/styles/editor.css"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"
import { createPostAction } from "@/actions/post"
import { Button } from "@/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/form"
import { Icons } from "@/util/icons"
import type EditorJS from "@editorjs/editorjs"
import type { ToolConstructable, ToolSettings } from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"

import { uploadFiles } from "@/lib/upload"
import { PostSchema, type ZPost } from "@/lib/validators/post"
import { toast } from "@/hooks/use-toast"

interface EditorProps {
  communityId: string
}

export default function Editor({ communityId }: EditorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isMounted, setIsMounted] = useState(false)

  const form = useForm<ZPost>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      communityId,
      title: "",
      content: null,
    },
  })

  const ref = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement | null>(null) //our ref for title

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    const Embed = (await import("@editorjs/embed")).default as ToolSettings
    const Table = (await import("@editorjs/table")).default as ToolSettings
    const List = (await import("@editorjs/list")).default as ToolSettings
    const Code = (await import("@editorjs/code")).default as ToolSettings
    const LinkTool = (await import("@editorjs/link"))
      .default as ToolConstructable
    const InlineCode = (await import("@editorjs/inline-code"))
      .default as ToolSettings
    const ImageTool = (await import("@editorjs/image"))
      .default as ToolConstructable

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
        },
        placeholder: "Write here to write your post....",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({
                    files: [file],
                    endpoint: "imageUploader",
                  })
                  //   const [res] = await uploadFiles([file], "imageUploader")

                  return {
                    success: 1,
                    file: {
                      url: res?.fileUrl,
                    },
                  }
                },
              },
            },
          },
        },
      })
    }
  }, [])

  // Checking if editor is mountable on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        _titleRef.current?.focus()
      }, 0)
      // this moves the focusing action to the end of the call stack
    }
    if (isMounted) {
      void init()

      return () => {
        // cleanup
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  async function onSubmit({ title, communityId }: ZPost) {
    const content = await ref.current?.save()
    const payload: ZPost = {
      title,
      content,
      communityId,
    }

    startTransition(async () => {
      try {
        await createPostAction(payload)
        toast({
          title: "Success",
          description: "Your post has been published",
        })
        // Basically /mycommunity/submit -> /mycommunity
        const newPathname = pathname.split("/").slice(0, -1).join("/")
        router.push(newPathname as Route)
        router.refresh()
      } catch (e) {
        if (e instanceof Error) {
          toast({
            title: "Error",
            description: e.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          })
        }
      }
    })
  }

  return (
    <div className="w-full rounded-lg bg-background p-4 md:p-6">
      {/* <div className="w-full rounded-lg border border-accent bg-background p-4 md:p-6"> */}
      <Form {...form}>
        <form
          className="w-full"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <div className="prose prose-stone w-full max-w-full dark:prose-invert">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                const { ref, ...rest } = field //removing the hook-form's ref to add our own
                return (
                  <FormItem>
                    <FormControl>
                      <TextareaAutosize
                        ref={(e) => {
                          _titleRef.current = e
                        }}
                        placeholder="Title"
                        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold focus:outline-none md:text-5xl"
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage className="my-2" />
                  </FormItem>
                )
              }}
            />
          </div>
          <div id="editor" className="min-h-[400px]" />
          <p className="text-sm text-muted-foreground">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
          <Button type="submit" disabled={isPending} className="mt-7 w-full">
            {isPending ? (
              <Icons.loading className="h-4 w-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
