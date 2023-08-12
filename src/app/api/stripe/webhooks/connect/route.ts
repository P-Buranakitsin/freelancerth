import { responses } from "@/constants/responses";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
    apiVersion: "2022-11-15"
});
const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET_CONNECT!

export async function POST(req: NextRequest) {
    // Code partly from https://github.com/vercel/next.js/blob/canary/examples/with-stripe-typescript/pages/api/webhooks/index.ts
    const body = await req.text();
    const sig = req.headers.get('Stripe-Signature') as string;
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

            const groupedGigIdByFreelancerId = JSON.parse(charge.metadata.groupedGigIdByFreelancerId) as Record<string, { gigId: string; gigPrice: number }[]>
            const gigsId = Object.values(groupedGigIdByFreelancerId).flat();

            await Promise.all([
                ...Object.entries(groupedGigIdByFreelancerId).map(([key, value]) => {
                    const totalGigPrice = value.reduce((acc, obj) => acc + obj.gigPrice, 0).toFixed(2);
                    return Promise.all([
                        prisma.customerOrder.create({
                            data: {
                                freelancerProfileId: key,
                                orderHistoryId: charge.id,
                                gigs: {
                                    create: value.map((el) => {
                                        return {
                                            gigId: el.gigId,
                                        };
                                    }),
                                },
                            },
                        }),
                        prisma.freelancerProfile.update({
                            where: {
                                id: key
                            },
                            data: {
                                balance: {
                                    increment: totalGigPrice
                                },
                                totalAmountReceived: {
                                    increment: totalGigPrice
                                }
                            }
                        })
                    ]);
                }),
                prisma.cart.delete({ where: { userId: charge.metadata.userId } }),
                prisma.orderHistory.create({
                    data: {
                        amount: charge.amount / 100,
                        createdAt: date,
                        id: charge.id,
                        receiptUrl: charge.receipt_url || "",
                        userId: charge.metadata.userId,
                        gigs: {
                            create: gigsId.map((el) => {
                                return {
                                    gigId: el.gigId,
                                };
                            }),
                        },
                    },
                }),
            ]);


        } else if (event.type === 'checkout.session.completed') {
            const checkout = event.data.object as Stripe.Checkout.Session
            console.log(checkout.id)
        } else if (event.type === 'account.updated') {
            const accountEvent = event.data.object as Stripe.Account
            console.log(accountEvent)
            if (accountEvent.charges_enabled) {
                await prisma.freelancerProfile.update({
                    where: {
                        id: accountEvent.metadata?.freelancerId || ""
                    },
                    data: {
                        stripeRegistered: true
                    }
                })
            }
        } else if (event.type === 'transfer.created') {
            const transfer = event.data.object as Stripe.Transfer
            await prisma.freelancerProfile.update({
                where: {
                    id: transfer.metadata.freelancerId || ""
                },
                data: {
                    balance: 0,
                }
            })
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