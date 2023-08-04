import { SkillName } from '@prisma/client';
import { z } from "zod";

export const FreelancerProfileSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    skills: z.nativeEnum(SkillName).array(),
    bio: z.string(),
    resumeOrCV: z.string(),
    linkedInURL: z.string(),
    githubURL: z.string(),
    portfolioURL: z.string()
})

export type FreelancerProfile = z.infer<typeof FreelancerProfileSchema>