import { z } from "zod"

export const CommentSchema = z.object({
  postId: z.string(),
  comment: z
    .string()
    .min(1, { message: "Comments should be atleast one character long" }),
  replyToId: z.string().optional(),
})

export type ZComment = z.infer<typeof CommentSchema>

export const CommentVoteSchema = z.object({
  commentId: z.string(),
  type: z.enum(["UP", "DOWN"]),
})

export type ZCommentVote = z.infer<typeof CommentVoteSchema>
