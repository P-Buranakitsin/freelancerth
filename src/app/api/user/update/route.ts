import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

export const PUT = async (req: NextRequest, res: NextResponse) => {
    const session = await getServerSession(
        req as unknown as NextApiRequest,
        {
            ...res,
            getHeader: (name: string) => res.headers?.get(name),
            setHeader: (name: string, value: string) => res.headers?.set(name, value),
        } as unknown as NextApiResponse,
        authOptions
    );
    try {
        const json = await req.json();
        if (session?.user?.email) {
            const user = await prisma.user.update({
                where: {
                    email: session.user.email
                },
                data: {
                    name: json.name
                }
            })
            let json_response = {
                status: "success",
                data: {
                    user,
                },
            };
            return NextResponse.json((json_response), {
                status: 200,
            });
        }
        return NextResponse.json({})
    } catch (error) {
        return NextResponse.json({})
    }
}