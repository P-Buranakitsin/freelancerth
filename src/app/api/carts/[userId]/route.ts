import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { responses } from '@/constants/responses';
import { prisma } from '@/lib/prisma';

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin trying to put another user
    if (!token || (token.role !== "ADMIN" && token.sub !== params.userId)) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }
    try {
        const cart = await prisma.cart.findUniqueOrThrow({
            where: {
                userId: params.userId
            },
            select: {
                gigs: {
                    select: {
                        gig: true,

                    }
                }
            },
        })
        const subtotalPrice = cart.gigs.reduce((total, gig) => total + parseFloat((gig.gig.price as any)), 0);
        const totalServiceFee = 0.2 * subtotalPrice
        const totalPrice = subtotalPrice + totalServiceFee
        const successResponse = responses({ ...cart, subtotalPrice, totalServiceFee, totalPrice }).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}

export const PUT = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin trying to put another user
    if (!token || (token.role !== "ADMIN" && token.sub !== params.userId)) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }
    try {
        const json = await req.json();

        const count = await prisma.gigsOnCart.count({
            where: {
                userId: params.userId
            }
        })

        if (count >= 3) {
            throw new Error("too many items in cart")
        }

        const gig = await prisma.gig.findUnique({
            where: {
                id: json.gigId
            },
            select: {
                freelancerProfile: {
                    select: {
                        userId: true
                    }
                }
            }

        })
        if (gig?.freelancerProfile.userId === params.userId) {
            throw new Error("cannot add your own gig to cart")
        }

        const cart = await prisma.cart.upsert({
            where: {
                userId: params.userId,
            },
            create: {
                userId: params.userId,
                gigs: {
                    create: [{
                        gig: {
                            connect: {
                                id: json.gigId
                            }
                        }
                    }]
                }
            },
            update: {
                userId: params.userId,
                gigs: {
                    create: [{
                        gig: {
                            connect: {
                                id: json.gigId
                            }
                        }
                    }]
                }
            }
        })
        const successResponse = responses(cart).success
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
        if (error.code === "P2002") {
            const errorResponse = responses("item is already in your cart").internalError
            return NextResponse.json(errorResponse.body, errorResponse.status)
        }
        const errorResponse = responses(error.message).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}