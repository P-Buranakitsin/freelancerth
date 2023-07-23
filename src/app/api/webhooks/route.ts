import { responses } from "@/constants/responses";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
    apiVersion: "2022-11-15"
});
const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!


export async function POST(req: NextRequest) {
    // Code partly from https://github.com/vercel/next.js/blob/canary/examples/with-stripe-typescript/pages/api/webhooks/index.ts
    const body = await req.text();
    const sig = headers().get('Stripe-Signature') as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        // Successfully constructed event.
        console.log('✅ Success:', event.id)

        // Cast event data to Stripe object.
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            console.log(`💰 PaymentIntent status: ${paymentIntent.status}`)
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            console.log(
                `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
            )

        } else if (event.type === 'charge.succeeded') {
            const charge = event.data.object as Stripe.Charge
            console.log(`💵 Charge id: ${charge.id}`)

            // charge.created is UNIX timestamp
            const timestamp = charge.created;
            const date = new Date(timestamp * 1000);

            await Promise.all([
                prisma.cart.delete({ where: { userId: charge.metadata.userId } }),
                prisma.purchasedOrder.create({
                    data: {
                        amount: charge.amount / 100,
                        createdAt: date,
                        id: charge.id,
                        receiptUrl: charge.receipt_url || "",
                        userId: charge.metadata.userId
                    }
                }),
            ]);
        } else if (event.type === 'checkout.session.completed') {
            const checkout = event.data.object as Stripe.Checkout.Session
            console.log(checkout.id)
        } else {
            console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
        }

        const successResponse = responses({}).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error: any) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}