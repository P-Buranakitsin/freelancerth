declare interface IResponseGETOrderHistoryByUserId {
    message: string
    data?: [] | IResponseDataGETOrderHistoryByUserId[]
    error?: any
}

declare interface IResponseDataGETOrderHistoryByUserId {
    id: string
    userId: string
    amount: string
    createdAt: string
    receiptUrl: string
    paymentStatus: import('@prisma/client').PaymentStatus
}