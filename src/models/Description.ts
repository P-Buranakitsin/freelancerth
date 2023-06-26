import { z } from 'zod'

export const DescriptionSchema = z.object({
    description: z.string().trim().max(100).optional(),
})

export type Description = z.infer<typeof DescriptionSchema>