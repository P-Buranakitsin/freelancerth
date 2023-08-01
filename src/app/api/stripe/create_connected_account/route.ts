import { endpoints } from "@/constants/endpoints";
import { responses } from "@/constants/responses";
import { prisma } from "@/lib/prisma";
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
        const body = await req.json() as IRequestPOSTCreateConnectedAccount

        let accountId: string
        if (!body.stripAccountId) {
            const account = await stripe.accounts.create({
                country: 'GB',
                type: 'express',
                business_type: 'individual',
                metadata: {
                    freelancerId: body.freelancerId
                }
            });
            await prisma.freelancerProfile.update({
                where: {
                    userId: token?.sub || ""
                },
                data: {
                    stripeAccountId: account.id
                }
            })
            accountId = account.id
        } else {
            accountId = body.stripAccountId
        }

        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${process.env.BASE_URL}${endpoints.PAGE.freelancerProfilePage(body.freelancerId)}`,
            return_url: `${process.env.BASE_URL}${endpoints.PAGE.freelancerProfilePage(body.freelancerId)}`,
            type: 'account_onboarding',
        })
        const successResponse = responses(accountLink).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error: any) {
        console.log(error)
        const errorResponse = responses(error.message).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}