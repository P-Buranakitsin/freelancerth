declare interface IResponseGETGigs {
    message: string
    data: IResponseDataGETGigs[]
    pagination: import('@/constants/responses').IPagination;

}

declare interface IResponseGETGig {
    message: string
    data: IResponseDataGETGigs
}

declare interface IResponseDataGETGigs {
    id: string,
    title: string,
    type: GigType,
    description: string,
    freelancerProfileId: string,
    freelancerProfile: {
        user: {
            id: string,
            name: string,
            email: string,
            emailVerified: Date,
            image: string,
            role: import('@prisma/client').UserRole
        }
        type: FreelancerType,
        bio: string,
        skills: SkillName[]
    },
    price: string
    image: string
    createdAt: string
    updatedAt: string
    searchTags: SkillName[]
}

declare interface IRequestDELETEGigByGigId {
    gigId: string
}

declare interface IRequestPatchGigByGigId {
    title?: string
    description?: string
    searchTags?: SkillName[]
    price?: number
    image?: string
    gigId: string
}