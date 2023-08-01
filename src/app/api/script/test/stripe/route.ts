import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { responses } from "@/constants/responses";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
    apiVersion: "2022-11-15"
});

export const GET = async (req: NextRequest) => {
    try {
        // (stripe.accounts.retrieve().then(async (res) => {
        //     console.log(res.id)
        //     const account = await stripe.accounts.create({
        //         country: 'GB',
        //         type: 'express',
        //     });
        //     console.log(account)
        //     const accountLink = await stripe.accountLinks.create({
        //         account: account.id,
        //         refresh_url: 'https://example.com/reauth',
        //         return_url: 'https://example.com/return',
        //         type: 'account_onboarding',
        //     });
        //     console.log(accountLink)
        // }))

        // const res = await stripe.accounts.createLoginLink('acct_1Na1AqPpmOYvJgpN')
        // console.log(res)

        // const transfer = await stripe.transfers.create({
        //     amount: 100,
        //     currency: 'gbp',
        //     destination: 'acct_1Na1AqPpmOYvJgpN',
        //   });
        await stripe.accounts.del("acct_1Na7EKPwzTSNtkRH")
        const successResponse = responses({}).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}
