"use client"

import Image from "next/image"

interface CodeRendererProps {
  data: {
    code: string
  }
}

export function CustomCodeRenderer({ data }: CodeRendererProps) {
  return (
    <pre className="rounded-md bg-muted p-4">
      <code className="text-sm text-accent-foreground">{data.code}</code>
    </pre>
  )
}

interface ImageRendererProps {
  data: { file: { url: string } }
}
export function CustomImageRenderer({ data }: ImageRendererProps) {
  const src = data.file.url

  return (
    <div className="relative min-h-[15rem] w-full">
      <Image alt="image" className="object-contain" fill src={src} />
    </div>
  )
}
