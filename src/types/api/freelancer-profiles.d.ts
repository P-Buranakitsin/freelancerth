type SkillName = import('@prisma/client').SkillName;
type FreelancerType = import('@prisma/client').FreelancerType;

declare interface IResponsGETFreelancerProfileByUserId {
    message: string
    data: {
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
    } | null
}

declare interface IRequestPatchFreelancerByUserId {
    bio?: string
    skills?: SkillName[]
    passportOrId?: string
    resumeOrCV?: string
    linkedInURL?: string
    githubURL?: string
    portfolioURL?: string
}

declare interface IResponseGETFreelancerProfiles {
    message: string
    data?: {
        totalFreelancerProfile: number
    }
    error?: any
}