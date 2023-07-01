"use client"

import dynamic from "next/dynamic"
import { Icons } from "@/util/icons"
import type { Prisma } from "@prisma/client"

import { CustomCodeRenderer, CustomImageRenderer } from "./renderers"

interface EditorOutputProps {
  content: Prisma.JsonValue
}

const Output = dynamic(
  () => import("editorjs-react-renderer").then((e) => e.default),
  {
    ssr: false,
    loading: () => (
      <Icons.loading className="absolute right-[50%] h-4 w-4 animate-spin" />
    ),
  }
)

const outputStyle = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
}

export default function EditorOutput({ content }: EditorOutputProps) {
  return (
    <Output
      data={content}
      style={outputStyle}
      className="text-sm"
      renderers={renderers}
    />
  )
}
