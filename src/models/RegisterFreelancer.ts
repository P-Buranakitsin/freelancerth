import { FreelancerType } from '@prisma/client';
import { z } from 'zod'

export const RegisterFreelancerSchema = z.object({
    profilePic: z.string().nonempty({message: "Required"}),
    firstName: z
        .string().trim()
        .max(25).nonempty({ message: "Required" }),
    lastName: z
        .string().trim()
        .max(25).nonempty({ message: "Required" }),
    bio: z.string().trim().min(50).max(250),
    passportOrIdImage: z.any().array().min(1).max(1),
    freelancerType: z.nativeEnum(FreelancerType),
})

export type RegisterFreelancer = z.infer<typeof RegisterFreelancerSchema>