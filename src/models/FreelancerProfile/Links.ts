import { z } from 'zod'

export const LinkSchema = z.object({
    linkedInURL: z.string().trim().max(200).optional(),
    githubURL: z.string().trim().max(200).optional(),
    portfolioURL: z.string().trim().max(200).optional(),
})

export type Link = z.infer<typeof LinkSchema>