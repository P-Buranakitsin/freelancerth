import { responses } from "@/constants/responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
    apiVersion: "2022-11-15"
});

export const POST = async (req: NextRequest) => {
    const token = await getToken({ req })

    // Not Signed in
    if (!token) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }

    try {
        const body = await req.json() as IRequestPOSTCreateLoginLink

        const res = await stripe.accounts.createLoginLink(body.accountId)

        const successResponse = responses(res).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error: any) {
        console.log(error)
        const errorResponse = responses(error.message).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}