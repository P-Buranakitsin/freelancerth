import { NextRequest, NextResponse } from "next/server";
import { responses } from "@/constants/responses";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";

export const POST = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const token = await getToken({ req })
    // Not Signed in
    if (!token?.sub) {
        const unauthorizedResponse = responses().unauthorized
        return NextResponse.json(unauthorizedResponse.body, unauthorizedResponse.status)
    }
    try {
        const data = []
        for (let i = 0; i < 43; i++) {
            const input: Prisma.OrderHistoryUncheckedCreateInput = {
                amount: 9.99,
                createdAt: new Date(new Date().getTime() + i * 60 * 1000),
                id: 'ch_mock_' + i,
                receiptUrl: "https://www.google.co.uk/",
                userId: token.sub || ""
            }
            data.push(input)
        }
        const orderHistory = await prisma.orderHistory.createMany({
            data
        })
        const successResponse = responses(orderHistory).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}

export const DELETE = async (req: NextRequest) => {

    try {
        const purchasedOrder = await prisma.orderHistory.deleteMany({})
        const successResponse = responses(purchasedOrder).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }

}