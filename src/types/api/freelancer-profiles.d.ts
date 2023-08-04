type SkillName = import('@prisma/client').SkillName;
type FreelancerType = import('@prisma/client').FreelancerType;

declare interface IResponseDataGETFreelancerProfileByUserId {
    id: string
    userId: string
    type: FreelancerType
    verified: boolean
    bio: string
    passportOrId: string
    resumeOrCV: string
    linkedInURL: string
    githubURL: string
    portfolioURL: string
    skills: SkillName[]
    totalAmountReceived: string
    balance: string
    stripeAccountId: string
    stripeRegistered: boolean
}
declare interface IResponsGETFreelancerProfileByUserId {
    message: string
    data: IResponseDataGETFreelancerProfileByUserId | null
}

declare interface IRequestPatchFreelancerByUserId {
    bio?: string
    skills?: SkillName[]
    passportOrId?: string
    resumeOrCV?: string
    linkedInURL?: string
    githubURL?: string
    portfolioURL?: string
    verified?: boolean
}

declare interface IResponseGETFreelancerProfiles {
    message: string
    data?: IResponseDataGETFreelancers[]
    error?: any
    pagination?: import('@/constants/responses').IPagination;
}

declare interface IResponseDataGETFreelancers {
    id: string
    userId: string
    type: FreelancerType
    verified: boolean
    bio: string
    passportOrId: string
    resumeOrCV: string
    linkedInURL: string
    githubURL: string
    portfolioURL: string
    skills: SkillName[]
    totalAmountReceived: string
    balance: string
    stripeAccountId: string
    stripeRegistered: boolean
    user: {
        id: string
        name: string
        email: string
        emailVerified: string
        image: string
        role: string
    }
}