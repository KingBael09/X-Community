import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { buttonVariants } from "@/ui/button"
import { Icons } from "@/util/icons"
import type { Post, Prisma, User, Vote } from "@prisma/client"

import type { CachedPost } from "@/types/redis"
import { siteConfig } from "@/config/site"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { formatTimeToNow } from "@/lib/utils"
import { CommentSection } from "@/components/comments/comment-section"
import { EditorOutput } from "@/components/editor/editor-output"
import { PostVoteServer } from "@/components/post-vote/post-vote-server"

interface PostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await db.post.findFirst({
    where: {
      id: params.id,
    },
  })

  return {
    title: `${post?.title as string} : ${siteConfig.name}`,
    description: `${post?.title || "Post"} -${
      post?.updatedAt.toDateString() as string
    }`,
  }
}

// export const dynamic = "force-dynamic"
// export const fetchCache = "force-no-store"

type CustomPost = (Post & { votes: Vote[]; author: User }) | null

export default async function Page({ params }: PostPageProps) {
  // check for if the post is cached
  const cachedPost = (await redis.hgetall(
    `post:${params.id}`
  )) as unknown as CachedPost
  // const cachedPost: CachedPost = null
  let post: CustomPost = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.id,
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
        id: params.id,
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
        <div className="hidden md:block">
          <Suspense fallback={<PostVoteShell />}>
            <PostVoteServer
              postId={post?.id ?? cachedPost.id}
              getData={getData}
            />
          </Suspense>
        </div>
        <div className="w-full flex-1 rounded-sm bg-background sm:w-0">
          <p className="mt-1 max-h-40 truncate text-xs">
            Posted by u/{post?.author.username ?? cachedPost?.authorUserName}{" "}
            Posted by u/
            {formatTimeToNow(
              new Date(post?.createdAt ?? cachedPost?.createdAt)
            )}
          </p>
          <h1 className="py-2 text-xl font-semibold leading-6">
            {/* {post?.title ?? cachedPost.title} */}
            {post?.title}
          </h1>
          <EditorOutput
            content={post?.content ?? (cachedPost?.content as Prisma.JsonValue)}
          />
          <div className="mt-2 md:hidden">
            <Suspense fallback={<PostVoteShell />}>
              <PostVoteServer
                postId={post?.id ?? cachedPost.id}
                getData={getData}
                className="p-0"
              />
            </Suspense>
          </div>
          <Suspense
            fallback={<Icons.loading className="h-4 w-4 animate-spin" />}
          >
            <CommentSection postId={post?.id ?? cachedPost?.id} />
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
