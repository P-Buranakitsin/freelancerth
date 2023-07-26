import { responses } from "@/constants/responses"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export const DELETE = async (req: NextRequest) => {

    try {
        const customerOrder = await prisma.customerOrder.deleteMany({})
        const successResponse = responses(customerOrder).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }

}