import { endpoints } from "@/constants/endpoints";
import { responses } from "@/constants/responses";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { authOptions } from "../auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
    apiVersion: "2022-11-15"
});

export async function POST(req: NextRequest) {
    const token = await getToken({ req })
    const data = await getServerSession(authOptions);
    // Not Signed in or not an admin trying to put another user
    if (!token) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }
    try {
        const json = await req.json() as Stripe.Checkout.SessionCreateParams.LineItem[];

        // Create Checkout Sessions from body params.
        const params: Stripe.Checkout.SessionCreateParams = {
            submit_type: 'pay',
            payment_method_types: ['card'],

            line_items: json,
            mode: "payment",
            success_url: `${process.env.BASE_URL}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}${endpoints.PAGE.gigCart(data?.user.sub || "")}`,
        }
        const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)
        const successResponse = responses(checkoutSession).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error: any) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}