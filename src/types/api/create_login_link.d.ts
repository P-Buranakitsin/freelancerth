declare interface IRequestPOSTCreateLoginLink {
    accountId: string
}

declare interface IResponsePOSTCreateLoginLink {
    message: string
    data?: import('stripe').Stripe.Response<import('stripe').Stripe.LoginLink>
    error?: any
}