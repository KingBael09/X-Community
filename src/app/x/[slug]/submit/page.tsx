import { notFound } from "next/navigation"

import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Editor from "@/components/editor"

import type { CommunityPageProps } from "../layout"

export default async function Page({ params }: CommunityPageProps) {
  const community = await db.community.findFirst({
    where: {
      name: params.slug,
    },
  })

  if (!community) return notFound()

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-accent pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-muted-foreground">
            in r/{community.name}
          </p>
        </div>
      </div>
      <Editor communityId={community.id} />
      <PostForm />
    </div>
  )
}

function PostForm() {
  return (
    <div className="flex w-full justify-end">
      <Button>Post</Button>
    </div>
  )
}
