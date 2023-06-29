import { z } from "zod"

export const XFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Community name must be at least 2 characters.",
    })
    .max(25, {
      message: "Community name must be under 25 characters.",
    })
    .regex(/^[^\s]*$/, {
      message: "No spaces allowed",
    }),
})

export type ZForm = z.infer<typeof XFormSchema>
