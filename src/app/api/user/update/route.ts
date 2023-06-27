import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdatedUserSession } from "@/app/auth/new-user/page";
import { User } from "@prisma/client";

export interface IResponseUserUpdateAPI {
    data?: { user: User } | null
    message: string
    error?: unknown
}

export const PUT = async (req: NextRequest, res: NextResponse): Promise<NextResponse<IResponseUserUpdateAPI>> => {
    const session = await getServerSession(
        req as unknown as NextApiRequest,
        {
            ...res,
            getHeader: (name: string) => res.headers?.get(name),
            setHeader: (name: string, value: string) => res.headers?.set(name, value),
        } as unknown as NextApiResponse,
        authOptions
    );
    // Not Signed in
    if (!session) {
        return NextResponse.json({
            message: 'unauthorized access',
            data: null
        }, {
            status: 403
        })
    }

    try {
        const json: UpdatedUserSession = await req.json();
        if (!json.email) {
            return NextResponse.json({
                message: 'invalid input',
                data: null
            }, {
                status: 422
            })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: json.email },
        });

        if (!existingUser) {
            return NextResponse.json({
                message: "email not found",
                data: null
            }, {
                status: 400
            })
        }
        const user = await prisma.user.update({
            where: {
                email: json.email
            },
            data: {
                ...(json.name && { name: json.name }),
                ...(json.fileUrl && { image: json.fileUrl }),
                ...(json.role && { role: json.role })
            }
        })
        let json_response = {
            message: "success",
            data: {
                user,
            },
        };
        return NextResponse.json((json_response), {
            status: 200,
        });

    } catch (error) {
        return NextResponse.json({
            message: "internal server error",
            error
        }, {
            status: 500
        })
    }
}