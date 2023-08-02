
type UserRole = import('@prisma/client').UserRole
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
        skills: {
            skillName: SkillName
        }[]
        type: FreelancerType
        gigs: {
            id: string;
            title: string;
            type: FreelancerType
            description: string;
            freelancerProfileId: string;
            price: string;
            image: string;
            searchTags: { skillName: string }[]
        }[]
    }
    profile?: {
        city: string
        country: string
        description: string
    }
}

declare interface IResponseGETUserById {
    message: string
    data?: IResponseDataGETUserById
    error?: any
}

declare interface IResponseGETUsers {
    message: string
    data?: {
        totalUser: number
    }
    error?: any
}