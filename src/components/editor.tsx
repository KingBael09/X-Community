"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import type EditorJS from "@editorjs/editorjs"
import type { API, ToolConstructable, ToolSettings } from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"

import "@/styles/editor.css"

import { uploadFiles } from "@/lib/upload"
import { toast } from "@/hooks/use-toast"

import { PostSchema, type ZPost } from "../lib/validators/post"

interface EditorProps {
  communityId: string
}

export default function Editor({ communityId }: EditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const form = useForm<ZPost>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      communityId,
      title: "",
      content: null,
    },
  })

  // Checking if editor is mountable on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  const ref = useRef<EditorJS>()

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

  useEffect(() => {
    const init = async () => {
      await initializeEditor()
    }
    if (isMounted) {
      void init()

      return () => {}
    }
  }, [isMounted, initializeEditor])

  return (
    <div className="w-full rounded-lg border border-accent bg-background p-4 md:p-6">
      <form
        id="subreddit-post-form"
        className="w-full"
        // onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone w-full max-w-full dark:prose-invert">
          <TextareaAutosize
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold focus:outline-none md:text-5xl"
          />
          <div id="editor" className="min-h-[500px]" />
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </form>
    </div>
  )
}
