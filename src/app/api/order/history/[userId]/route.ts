import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";
import { PaymentStatus, Prisma } from "@prisma/client";

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin trying to get another order history
    if (!token || (token.role !== "ADMIN" && token.sub !== params.userId)) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }

    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.search)

        // Query params
        const page = Number(searchParams.get("page")) || 0
        const limit = Number(searchParams.get("limit")) || 10
        const paymentStatus = searchParams.getAll("paymentStatus") || undefined;

        const whereCondition: Prisma.OrderHistoryWhereInput = {
            userId: params.userId
        };

        if (paymentStatus.length > 0) {
            whereCondition.paymentStatus = {
                in: paymentStatus as PaymentStatus[]
            }
        }

        const [totalItems, data] = await prisma.$transaction([
            prisma.orderHistory.count({
                where: whereCondition,
            }),
            prisma.orderHistory.findMany({
                where: whereCondition,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    gigs: {
                        select: {
                            gig: {
                                select: {
                                    title: true,
                                    price: true,
                                    id: true,
                                    freelancerProfile: {
                                        select: {
                                            id: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                skip: page * limit,
                take: limit,
            })
        ])

        const flattenedData = data.map((order) => ({
            id: order.id,
            userId: order.userId,
            amount: order.amount,
            createdAt: order.createdAt,
            receiptUrl: order.receiptUrl,
            paymentStatus: order.paymentStatus,
            gigs: order.gigs.map((el) => ({
                title: el.gig.title,
                price: (Number(el.gig.price) * 1.2).toFixed(2),
                id: el.gig.id,
                freelancerId: el.gig.freelancerProfile.id,
            })),
        }));
        const pageCount = Math.ceil(totalItems / limit);
        const paginationResponse = responses(flattenedData, {
            limit,
            totalItems,
            totalPages: pageCount,
            page,
        }).pagination

        return NextResponse.json(paginationResponse.body, paginationResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}