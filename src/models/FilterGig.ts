import { FreelancerType, SkillName, GigType } from '@prisma/client';
import { z } from 'zod'

export const FilterGigSchema = z.object({
    gigTitle: z
        .string().trim()
        .max(50).optional(),
    freelancerType: z.nativeEnum(FreelancerType).optional(),
    skills: z.nativeEnum(SkillName).array().optional(),
    gigType: z.nativeEnum(GigType).optional(),
    startingPrice: z.enum(["CHEAP", "NORMAL", "EXPENSIVE"]).optional(),
})

export type FilterGig = z.infer<typeof FilterGigSchema>