type Country = import('@prisma/client').Country;

declare interface IResponseDataGETProfileByUserId {
    data: {
        id: string,
        userId: string,
        description: string,
        address: string,
        country: Country,
        city: string,
        phoneNumber: string,
        dob: null | Date,
        zip: string
    }
}