import { endpoints } from "@/constants/endpoints";
import { responses } from "@/constants/responses";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
    apiVersion: "2022-11-15"
});

export async function POST(req: NextRequest) {
    const token = await getToken({ req })
    // Not Signed in or not an admin trying to put another user
    if (!token) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }
    try {
        const count = await prisma.gigsOnCart.count({
            where: {
                userId: token.sub || ""
            }
        })
        if (count >= 3) {
            throw new Error("too many items in cart")
        }

        const body = await req.json() as IRequestPOSTCheckoutSessions;
        // Create Checkout Sessions from body params.
        const params: Stripe.Checkout.SessionCreateParams = {
            submit_type: 'pay',
            payment_method_types: ['card'],
            line_items: body.lineItems,
            success_url: `${process.env.BASE_URL}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}${endpoints.PAGE.gigCart(token.sub || "")}`,
            metadata: body.metaData,
            mode: "payment",
            payment_intent_data: {
                metadata: body.metaData
            },
        }
        const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)
        const successResponse = responses(checkoutSession).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error: any) {
        console.log(error)
        const errorResponse = responses(error.message).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}