"use client"

import { useRef } from "react"
import Link from "next/link"
import type { PostProps } from "@/types"
import { buttonVariants } from "@/ui/button"
import { Icons } from "@/util/icons"

import { cn, formatTimeToNow } from "@/lib/utils"

import EditorOutput from "./editorOutput"
import PostVoteClient from "./postVote/postVoteClient"

export default function Post({ post, votesAmt, currentVote }: PostProps) {
  const pref = useRef<HTMLDivElement>(null)
  return (
    <div className="rounded-md bg-accent/50 shadow">
      <div className="flex justify-between p-4 md:px-6 md:py-4">
        <PostVoteClient
          initialVoteAmt={votesAmt}
          initialVote={currentVote?.type}
          postId={post.id}
          className="hidden md:flex"
        />
        <div className="w-0 flex-1">
          <div className="mt-1 max-h-40 text-xs text-accent-foreground">
            {post.community.name && (
              <>
                <Link
                  className={cn(
                    buttonVariants({
                      variant: "link",
                      size: "sm",
                    }),
                    "p-0 underline hover:text-muted-foreground"
                  )}
                  href={`/x/${post.community.name}`}
                >
                  x/{post.community.name}
                </Link>
                <span className="px-1">•</span>
              </>
            )}
            {/* TODO: Profile pages maybe? */}
            <span>posted by u/{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <Link href={`/x/${post.community.name}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6">
              {post.title}
            </h1>
          </Link>
          <div
            className="relative max-h-40 w-full overflow-hidden text-clip text-sm"
            ref={pref}
          >
            <EditorOutput content={post.content} />
            {pref.current?.clientHeight === 160 && (
              <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-accent/50 to-transparent" />
            )}
          </div>
        </div>
      </div>
      <div className="z-20 flex rounded-md p-4 text-sm sm:px-6">
        <PostVoteClient
          initialVoteAmt={votesAmt}
          initialVote={currentVote?.type}
          postId={post.id}
          className=" mr-auto p-0 md:hidden"
        />
        <Link
          href={`/x/${post.community.name}/post/${post.id}`}
          className="flex w-fit items-center gap-2"
        >
          <Icons.comment className="h-4 w-4" />
          <span>{post.comments.length} comments</span>
        </Link>
      </div>
    </div>
  )
}

// TODO: Think wethere to prefetch or not
