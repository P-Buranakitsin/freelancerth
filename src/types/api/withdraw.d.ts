declare interface IRequestPOSTWithdraw {
    accountId: string
    amount: string
    freelancerId: string
}

declare interface IResponsePOSTWithdraw {
    message: string
    data?: import('stripe').Stripe.Response<import('stripe').Stripe.Transfer>
    error?: any
}