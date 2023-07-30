import { z } from 'zod'

export const BioSchema = z.object({
    bio: z.string().trim().min(10).max(300).optional(),
})

export type Bio = z.infer<typeof BioSchema>