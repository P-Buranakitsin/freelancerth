declare interface IResponseGETGigs {
    message: string
    data: IResponseDataGETGigs[]
    pagination: import('@/constants/responses').IPagination;

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
        type: FreelancerType
    },
    price: number,
    image: string
    searchTags: SkillName[]
}