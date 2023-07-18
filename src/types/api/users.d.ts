import { UserRole } from '@prisma/client';
type FreelancerType = import('@prisma/client').FreelancerType;
declare interface IResponseDataPATCHUserById {
    message: string
    data: {
        email: string
        emailVerified: string
        id: string
        image: string | null
        name: string
        role: FreelancerType
    }
}

declare interface IResponseDataGETUserById {
    id: string
    name: string
    email: string
    emailVerified: string
    image: string
    role: UserRole
    FreelancerProfile?: {
        bio: string
        githubURL: string
        linkedInURL: string
        portfolioURL: string
        skills: SkillName[]
        type: FreelancerType
    }
    profile?: {
        city: string
        country: string
        description: string
    }
}

declare interface IResponseGETUserById {
    message: string
    data: IResponseDataGETUserById
}