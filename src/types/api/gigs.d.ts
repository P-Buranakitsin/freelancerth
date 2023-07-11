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
    price: number,
    image: string
    searchTags: SkillName[]
}