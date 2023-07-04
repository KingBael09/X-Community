"use client"

import { useEffect, useRef } from "react"
import { INFINITE_SCROLLING_PAGENATION_RESULTS } from "@/config"
import type { ExtendedPost, FeedProps } from "@/types"
import { Icons } from "@/util/icons"
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"

import Post from "./post"

export default function PostFeed({
  initialPosts,
  communityName,
  user,
  isMainFeed = false,
  limit,
}: FeedProps) {
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      ["load-post"],
      async ({ pageParam = 1 }) => {
        const query =
          `/api/posts?limit=${INFINITE_SCROLLING_PAGENATION_RESULTS}&page=${
            pageParam as string
          }` + (!!communityName ? `&communityName=${communityName}` : "")

        const req = await fetch(query)
        const res = (await req.json()) as ExtendedPost[]
        // TODO:  Try server action here
        return res
      },
      {
        getNextPageParam: (lastPage, pages) => {
          if (pages.length <= limit) return pages.length + 1
          else return undefined
        },
        initialData: {
          pages: [initialPosts],
          pageParams: [1],
        },
      }
    )

  useEffect(() => {
    if (entry?.isIntersecting) {
      void fetchNextPage()
    }
  }, [entry, fetchNextPage])

  // fattening array to join nextPage array to current array
  const posts = data?.pages.flatMap((page) => page) ?? initialPosts

  if (user && initialPosts.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-accent/50 px-1 py-4 text-center leading-6 text-muted-foreground [text-wrap:balance]">
        {isMainFeed
          ? "Subscribe to some communities to view to see them of feed!"
          : "No Posts Yet!"}
      </div>
    )
  }

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
          <li
            key={post.id}
            ref={i === posts.length - 1 ? ref : undefined}
            data-attr={i === posts.length - 1 ? "ref_true" : "ref_false"}
          >
            <Post post={post} votesAmt={votesAmt} currentVote={currentVote} />
          </li>
        )
      })}
      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Icons.loading className="h-6 w-6 animate-spin" />
        </li>
      )}
      {!hasNextPage && (
        <div className="rounded-lg border border-accent py-4 text-center text-muted-foreground">
          You have reached the end!
        </div>
      )}
    </ul>
  )
}

// TODO: Try to convert this into a server component
