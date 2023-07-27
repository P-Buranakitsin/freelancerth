declare interface IResponseGETCustomerOrderByFreelancerId {
    message: string
    data?: [] | IResponseDataGETCustomerOrderByFreelancerId[]
    error?: any
    pagination?: import('@/constants/responses').IPagination
    totalAmountReceived?: string
}

declare interface IResponseDataGETCustomerOrderByFreelancerId {
    orderHistoryId: string
    freelancerProfileId: string
    orderHistory: {
        id: string
        userId: string
        createdAt: string
        receiptUrl: string
        paymentStatus: import('@prisma/client').PaymentStatus
        user: {
            id: string
            name: string
            email: string
            emailVerified: boolean | null
            image: string
            role: import('@prisma/client').UserRole
        }
    }
    gigs: Array<{
        id: string
        title: string
        price: string
        freelancerProfileId: string
    }>
    amountReceived: string
}