declare interface IResponseDataGETGigs {
    message: string
    data: {
        id: string,
        title: string,
        type: GigType,
        description: string,
        freelancerProfileId: string,
        price: number,
        image: string
        searchTags: SkillName[]
    }[]
    total: number

}