declare interface IResponseGETGigs {
    message: string
    data: IResponseDataGETGigs[]
    total: number
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