import { z } from "zod"

export const PostSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(128, { message: "Title character limit exceeded (128 characters)" }),
  communityId: z.string(),
  content: z.any(),
})

export type ZPost = z.infer<typeof PostSchema>
