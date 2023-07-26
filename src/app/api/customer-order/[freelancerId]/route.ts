import { responses } from "@/constants/responses";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

function calculateAmountReceivedForEachOrder(gigs: any[]): string {
    let amountReceived = 0;

    for (const gig of gigs) {
        amountReceived += parseFloat(gig.gig.price);
    }
    // Multiply with 0.8 because service fee for freelancers is 20%
    return (amountReceived * 0.8).toFixed(2);
}

export const GET = async (req: NextRequest, { params }: { params: { freelancerId: string } }) => {
    const token = await getToken({ req })
    const freelancerProfile = await prisma.freelancerProfile.findUnique({
        where: {
            userId: token?.sub || ""
        }
    })

    // Not Signed in or not an admin trying to get another customer order
    if (!token || (token.role !== "ADMIN" && freelancerProfile?.id !== params.freelancerId)) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }

    try {
        const url = new URL(req.url);
        const params = new URLSearchParams(url.search)

        // Query params
        const page = Number(params.get("page")) || 0
        const limit = Number(params.get("limit")) || 6

        const whereCondition: Prisma.CustomerOrderWhereInput = {
            freelancerProfileId: freelancerProfile?.id || ""
        }

        const [totalItems, data] = await prisma.$transaction([
            prisma.customerOrder.count({
                where: whereCondition,
            }), prisma.customerOrder.findMany({
                where: whereCondition,
                orderBy: {
                    orderHistory: {
                        createdAt: "desc"
                    }
                },
                include: {
                    orderHistory: {
                        select: {
                            id: true,
                            userId: true,
                            createdAt: true,
                            receiptUrl: true,
                            paymentStatus: true,
                            user: true
                        }
                    },
                    gigs: {
                        select: {
                            gig: true
                        }
                    },
                },
                skip: page * limit,
                take: limit,
            })
        ])

        const formattedData = data.map((order) => ({
            ...order,
            gigs: order.gigs.map((el) => {
                return (
                    {
                        ...el.gig,
                        // 0.8 is service fee for freelancers
                        price: (Number(el.gig.price) * 0.8).toFixed(2)
                    }
                )
            }),
            amountReceived: calculateAmountReceivedForEachOrder(order.gigs),
        }));

        // Calculate the totalAmountReceived for all orders
        const totalAmountReceived = formattedData.reduce((total, order) => total + parseFloat(order.amountReceived), 0);

        const pageCount = Math.ceil(totalItems / limit);
        const paginationResponse = responses(formattedData, {
            limit,
            totalItems,
            totalPages: pageCount,
            page,
        }, totalAmountReceived.toFixed(2)).pagination

        return NextResponse.json(paginationResponse.body, paginationResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}