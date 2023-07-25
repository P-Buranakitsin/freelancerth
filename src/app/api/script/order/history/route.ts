import { NextRequest, NextResponse } from "next/server";
import { responses } from "@/constants/responses";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export const POST = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const token = await getToken({ req })
    // Not Signed in
    if (!token?.sub) {
        const unauthorizedResponse = responses().unauthorized
        return NextResponse.json(unauthorizedResponse.body, unauthorizedResponse.status)
    }
    try {
        for (let i = 0; i < 43; i++) {
            await prisma.orderHistory.create({
                data: {
                    amount: 5.99 * 1.2,
                    createdAt: new Date(new Date().getTime() + i * 60 * 1000),
                    id: 'ch_mock_' + i,
                    receiptUrl: "https://www.google.co.uk/",
                    userId: token.sub || "",
                    gigs: {
                        create: [{
                            gigId: "clk8ksqsb0007ujsky744ucnf"
                        }]
                    }
                }
            })
        }
        const successResponse = responses({}).success
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