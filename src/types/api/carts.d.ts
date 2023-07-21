
declare interface IResponseGETCartByUserId {
    message: string
    data?: null | IResponseDataGETCartByUserId
    error?: any
}

declare interface IResponseDataGETCartByUserId {
    gigs: {
        gig: {
            id: string;
            title: string;
            type: GigType;
            description: string;
            freelancerProfileId: string;
            price: Decimal;
            image: string;
        };
    }[];
    subtotalPrice: number;
    totalServiceFee: number;
    totalPrice: number;
}

declare interface IRequestPUTCartByUserId {
    gigId: string
}