import { INFINITE_SCROLLING_PAGENATION_RESULTS } from "@/config"
import type { User } from "next-auth"

import { db } from "@/lib/db"

import PostFeed from "./postFeed"

export async function GeneralFeed() {
  const limit = (await db.post.count()) / INFINITE_SCROLLING_PAGENATION_RESULTS

  const post = await db.post.findMany({
    take: INFINITE_SCROLLING_PAGENATION_RESULTS,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
  })

  return <PostFeed initialPosts={post} isMainFeed limit={limit} />
}

interface PersonalFeedProps {
  user: User
}

export async function PersonalFeed({ user }: PersonalFeedProps) {
  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: user.id,
    },
    include: {
      community: true,
    },
  })

  const followedCommunitesIds: string[] = []

  followedCommunities.forEach(({ communityId }) =>
    followedCommunitesIds.push(communityId)
  )

  const limit =
    (await db.post.count({
      where: {
        community: {
          id: {
            in: followedCommunitesIds,
          },
        },
      },
    })) / INFINITE_SCROLLING_PAGENATION_RESULTS

  const post = await db.post.findMany({
    where: {
      community: {
        id: {
          in: followedCommunitesIds,
        },
      },
    },
    take: INFINITE_SCROLLING_PAGENATION_RESULTS,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
  })

  return <PostFeed initialPosts={post} user={user} isMainFeed limit={limit} />
}
