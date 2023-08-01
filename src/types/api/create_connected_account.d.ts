declare interface IResponsePOSTCreateConnectedAccount {
    message: string
    data?: import('stripe').Stripe.Response<import('stripe').Stripe.AccountLink>
    error?: any
}

declare interface IRequestPOSTCreateConnectedAccount {
    stripAccountId: string
    freelancerId: string
}