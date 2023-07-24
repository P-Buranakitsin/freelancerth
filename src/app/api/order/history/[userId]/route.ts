import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";

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
        const orderHistory = await prisma.orderHistory.findMany({
            where: {
                userId: params.userId
            }
        })
        const successResponse = responses(orderHistory).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}