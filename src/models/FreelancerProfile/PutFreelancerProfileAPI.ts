import { SkillName } from '@prisma/client';
import { z } from 'zod'

// For back-end
export const PutFreelancerProfileSchema = z.object({
    bio: z.string().trim().min(10).max(300).optional(),
    passportOrId: z.string().trim().min(5).max(300).optional(),
    resumeOrCV: z.string().trim().min(5).max(300).optional(),
    linkedInURL: z.string().trim().max(200).optional(),
    githubURL: z.string().trim().max(200).optional(),
    portfolioURL: z.string().trim().max(200).optional(),
    skills: z.nativeEnum(SkillName).array().nonempty({ message: "At least one skill must be selected" }).optional(),
})

export type PutFreelancerProfile = z.infer<typeof PutFreelancerProfileSchema>