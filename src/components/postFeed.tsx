"use client"

import { useRef } from "react"
import { INFINITE_SCROLLING_PAGENATION_RESULTS } from "@/config"
import type { ExtendedPost } from "@/types"
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import type { User } from "next-auth"

import Post from "./post"

export interface FeedProps {
  initialPosts: ExtendedPost[]
  communityName?: string
  user: User | null
}

export default function PostFeed({
  initialPosts,
  communityName,
  user,
}: FeedProps) {
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["load-post"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGENATION_RESULTS}&page=${
          pageParam as string
        }` + (!!communityName ? `&communityName=${communityName}` : "")

      const req = await fetch(query)
      const res = await req.json()
      //   Try server action here
      return res as ExtendedPost[]
    },
    {
      getNextPageParam: (_, pages) => pages.length + 1,
      initialData: {
        pages: [initialPosts],
        pageParams: [1],
      },
    }
  )

  // fattening array to join nextPage array to current array
  const posts = data?.pages.flatMap((page) => page) ?? initialPosts

  return (
    <ul className="col-span-2 flex flex-col space-y-6">
      {posts.map((post, i) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1
          if (vote.type === "DOWN") return acc - 1
          return acc
        }, 0)

        const currentVote = post.votes.find((vote) => vote.userId === user?.id)

        return (
          <li key={post.id} ref={i === posts.length - 1 ? ref : undefined}>
            <Post post={post} votesAmt={votesAmt} currentVote={currentVote} />
          </li>
        )
      })}
    </ul>
  )
}

// TODO: Try to convert this into a server component
