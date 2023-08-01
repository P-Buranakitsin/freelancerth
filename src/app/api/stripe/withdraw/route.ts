import { responses } from "@/constants/responses";
import { WithdrawSchemaAPI } from "@/models/Stripe/Withdraw";
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
        const body = await req.json() as IRequestPOSTWithdraw

        const response = WithdrawSchemaAPI.safeParse(body);
        if (!response.success) {
            const { errors } = response.error;

            const errorResponse = responses(errors).badRequest
            return NextResponse.json(errorResponse.body, errorResponse.status)
        }

        const res = await stripe.transfers.create({
            currency: 'gbp',
            destination: body.accountId,
            amount: Number(body.amount) * 100,
            metadata: {
                freelancerId: body.freelancerId
            }
        })

        const successResponse = responses(res).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error: any) {
        console.log(error)
        if (error instanceof SyntaxError) {
            const badRequestResponse = responses().badRequest;
            return NextResponse.json(
                badRequestResponse.body,
                badRequestResponse.status
            );
        }
        const errorResponse = responses(error.message).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}