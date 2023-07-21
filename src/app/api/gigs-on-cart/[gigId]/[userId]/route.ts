import { NextResponse } from 'next/server';
import { responses } from '@/constants/responses';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const DELETE = async (req: NextRequest, { params }: { params: { gigId: string, userId: string } }) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin trying to delete another cart
    if (!token || (token.role !== "ADMIN" && token.sub !== params.userId)) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }
    try {
        const gigsOnCart = await prisma.gigsOnCart.delete({
            where: {
                gigId_userId: {
                    gigId: params.gigId,
                    userId: params.userId
                }
            }
        })
        const successResponse = responses(gigsOnCart).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}