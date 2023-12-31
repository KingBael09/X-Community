import { notFound } from "next/navigation"
import { INFINITE_SCROLLING_PAGENATION_RESULTS } from "@/config"
import type { CommunityPageProps, FeedProps } from "@/types"

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/session"
import { MiniCreatePost } from "@/components/dummy/mini-create-post"
import { PostFeed } from "@/components/post-feed/post-feed"

export default async function Page({ params }: CommunityPageProps) {
  const { slug } = params

  const user = await getAuthSession()

  const limit =
    (await db.post.count({
      where: {
        community: {
          name: slug,
        },
      },
    })) / INFINITE_SCROLLING_PAGENATION_RESULTS

  const community = await db.community.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        take: INFINITE_SCROLLING_PAGENATION_RESULTS,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
      },
    },
  })

  if (!community) return notFound()

  const feedProps: FeedProps = {
    user,
    communityName: community.name,
    initialPosts: community.posts,
    limit: limit,
  }

  return (
    <main>
      <h1 className="h-14 text-3xl font-bold md:text-4xl">
        x/{community.name}
      </h1>
      <MiniCreatePost user={user} />
      <PostFeed {...feedProps} />
    </main>
  )
}
