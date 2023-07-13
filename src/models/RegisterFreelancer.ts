import { FreelancerType, SkillName } from '@prisma/client';
import { z } from 'zod'

export const RegisterFreelancerSchema = z.object({
    profilePic: z.string().nonempty({ message: "Required" }),
    firstName: z
        .string().trim()
        .max(25).nonempty({ message: "Required" }),
    lastName: z
        .string().trim()
        .max(25).nonempty({ message: "Required" }),
    bio: z.string().trim().min(50).max(250),
    passportOrIdImage: z.any().array().min(1).max(1),
    freelancerType: z.nativeEnum(FreelancerType),
    skills: z.nativeEnum(SkillName).array().nonempty({ message: "At least one skill must be selected" }),
    resumeOrCV: z.any().array().min(1).max(1),
    linkedInURL: z.string().trim().max(200),
    githubURL: z.string().trim().max(200),
    portfolioURL: z.string().trim().max(200),
    term: z.boolean().refine(
        (value) => value === true,
        { message: 'You must accept this' }
    ),
})

export type RegisterFreelancer = z.infer<typeof RegisterFreelancerSchema>