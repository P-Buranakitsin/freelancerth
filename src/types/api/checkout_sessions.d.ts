declare interface IRequestPOSTCheckoutSessions {
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    metaData: Stripe.MetadataParam,
}