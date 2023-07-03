import { Suspense } from "react"
import { notFound } from "next/navigation"
import { type Post, type User, type Vote } from "@prisma/client"

import { type CachedPost } from "@/types/redis"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { formatTimeToNow } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CommentsSection } from "@/components/commentsSection"
import EditorOutput from "@/components/editorOutput"
import { PostVoteServer } from "@/components/postVote/postVoteServer"
import { Icons } from "@/components/util/icons"

interface PostPageProps {
  params: {
    postId: string
  }
}

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

type CustomPost = (Post & { votes: Vote[]; author: User }) | null

export default async function Page({ params }: PostPageProps) {
  // TODO : Enable Caching later

  // check for if the post is cached
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as unknown as CachedPost
  // const cachedPost: CachedPost = null
  let post: CustomPost = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    })
  }

  if (!post && !cachedPost) return notFound()

  const getData = async () => {
    const res = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    })
    return res
  }

  return (
    <div>
      <div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start">
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={getData}
          />
        </Suspense>
        <div className="w-full flex-1 rounded-sm bg-background sm:w-0">
          <p className="mt-1 max-h-40 truncate text-xs">
            Posted by u/{post?.author.username ?? cachedPost.authorUserName}{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="py-2 text-xl font-semibold leading-6">
            {post?.title ?? cachedPost.title}
          </h1>
          <EditorOutput content={post?.content ?? cachedPost.content} />
          <Suspense
            fallback={<Icons.loading className="h-4 w-4 animate-spin" />}
          >
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function PostVoteShell() {
  return (
    <div>
      <div className={buttonVariants({ variant: "ghost" })}>
        <Icons.up className="h-5 w-5" />
      </div>
      <p className="flex justify-center py-2 text-center text-sm font-medium">
        <Icons.loading className="h-4 w-4 animate-spin" />
      </p>
      <div className={buttonVariants({ variant: "ghost" })}>
        <Icons.down className="h-5 w-5" />
      </div>
    </div>
  )
}
