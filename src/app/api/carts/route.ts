import { responses } from "@/constants/responses";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin trying to get another profile
    if (!token || (token.role !== "ADMIN")) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }

    try {
        
        const carts = await prisma.cart.findMany({
            select: {
                userId: true,
                gigs: {
                    select: {
                        gig: true
                    },
                }
            },
        });
        const successResponse = responses(carts).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}
