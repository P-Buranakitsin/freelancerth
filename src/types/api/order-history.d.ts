declare interface IResponseGETOrderHistoryByUserId {
    message: string
    data?: [] | IResponseDataGETOrderHistoryByUserId[]
    error?: any
    pagination?: import('@/constants/responses').IPagination
}

declare interface IResponseDataGETOrderHistoryByUserId {
    id: string
    userId: string
    amount: string
    createdAt: string
    receiptUrl: string
    paymentStatus: import('@prisma/client').PaymentStatus
    gigs: {
        title: string
        price: string
        id: string
        freelancerProfileId: string
    }[]
}