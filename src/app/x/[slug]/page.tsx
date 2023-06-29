import { notFound } from "next/navigation"
import { INFINITE_SCROLLING_PAGENATION_RESULTS } from "@/config"

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/session"
import MiniCreatePost from "@/components/miniCreatePost"

import type { CommunityPageProps } from "./layout"

export default async function Page({ params }: CommunityPageProps) {
  const { slug } = params

  const user = await getAuthSession()

  const community = await db.community.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        take: INFINITE_SCROLLING_PAGENATION_RESULTS,
      },
    },
  })

  if (!community) return notFound()

  return (
    <main>
      <h1 className="h-14 text-3xl font-bold md:text-4xl">
        x/{community.name}
      </h1>
      <MiniCreatePost user={user} />
    </main>
  )
}
