"use client"

import dynamic from "next/dynamic"
import type { EditorOutputProps } from "@/types"
import { Icons } from "@/util/icons"

import { CustomCodeRenderer, CustomImageRenderer } from "./renderer"

const Output = dynamic(
  () => import("editorjs-react-renderer").then((e) => e.default),
  {
    ssr: false,
    loading: () => <Icons.loading className=" h-4 w-4 animate-spin" />,
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

export function EditorOutput({ content }: EditorOutputProps) {
  return (
    <Output
      data={content}
      style={outputStyle}
      className="text-sm"
      renderers={renderers}
    />
  )
}
