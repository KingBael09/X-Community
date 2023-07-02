import { notFound } from "next/navigation"
import type { CommunityPageProps } from "@/types"

import { db } from "@/lib/db"
import Editor from "@/components/editor"

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
            in x/{community.name}
          </p>
        </div>
      </div>
      <Editor communityId={community.id} />
    </div>
  )
}
