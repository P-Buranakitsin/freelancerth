import { NextRequest, NextResponse } from "next/server";
import { responses } from "@/constants/responses";
import { prisma } from "@/lib/prisma";

export const DELETE = async (req: NextRequest) => {

    try {
        const purchasedOrder = await prisma.purchasedOrder.deleteMany({})
        const successResponse = responses(purchasedOrder).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }

}