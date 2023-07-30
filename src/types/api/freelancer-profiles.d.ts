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
    } | null
}

declare interface IRequestPatchFreelancerByUserId {
    bio?: string
    skills?: SkillName[]
}