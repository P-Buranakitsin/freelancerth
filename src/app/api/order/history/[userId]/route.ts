import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";
import { Prisma } from "@prisma/client";

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
        const paymentStatus = searchParams.get("paymentStatus") || undefined;

        const whereCondition: Prisma.OrderHistoryWhereInput = {
            userId: params.userId
        };

        if (paymentStatus === "PAID" || paymentStatus === "REFUNDED") {
            whereCondition.paymentStatus = paymentStatus
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
                skip: page * limit,
                take: limit,
            })
        ])
        const pageCount = Math.ceil(totalItems / limit);
        const paginationResponse = responses(data, {
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