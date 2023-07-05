import { notFound } from "next/navigation"
import type { Post, User, Vote, VoteType } from "@prisma/client"

import { getAuthSession } from "@/lib/session"

import { PostVoteClient } from "./post-vote-client"

type CustomPost = (Post & { votes: Vote[]; author: User }) | null

interface ServerPostVoteProps {
  postId: string
  initialVoteAmt?: number
  initialVote?: VoteType | null
  getData?: () => Promise<CustomPost>
  className?: string
}

export async function PostVoteServer({
  postId,
  initialVote,
  initialVoteAmt,
  getData,
  className,
}: ServerPostVoteProps) {
  const user = await getAuthSession()

  let _votesAmt = 0
  let _currentVote: VoteType | null | undefined = undefined

  if (getData) {
    const post = await getData()
    if (!post) return notFound()

    _votesAmt = post.votes.reduce((acc, curr) => {
      if (curr.type === "UP") return acc + 1
      if (curr.type === "DOWN") return acc - 1
      return acc
    }, 0)

    _currentVote = post.votes.find((vote) => vote.userId === user?.id)?.type
  } else {
    _currentVote = initialVote
    _votesAmt = initialVoteAmt!
  }

  return (
    <PostVoteClient
      initialVote={_currentVote}
      initialVoteAmt={_votesAmt}
      postId={postId}
      className={className}
    />
  )
}
