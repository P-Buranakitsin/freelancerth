type SkillName = import('@prisma/client').SkillName;
type FreelancerType = import('@prisma/client').FreelancerType;

declare interface IResponseDataGETFreelancerProfileByUserId {
    message: string
    data: {
        id: string
        userId: string
        type: FreelancerType
        verified: boolean
        skills: SkillName[]
    } | null
}