import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

export const GET = async (req: NextRequest, res: NextResponse) => {
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
            data: {}
        }, {
            status: 403
        })
    }
    try {
        const profile = await prisma.profile.findFirst({
            where: {
                userId: session.user.sub
            }
        })
        return NextResponse.json({
            message: "success",
            data: {
                profile,
            }
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "internal server error",
            error
        }, {
            status: 500
        })
    }
}

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
    // Not Signed in
    if (!session) {
        return NextResponse.json({
            message: 'unauthorized access',
            data: {}
        }, {
            status: 403
        })
    }

    try {
        const json = await req.json();
        // Create or update profile
        const profile = await prisma.profile.upsert({
            where: {
                userId: session.user.sub
            },
            update: {
                ...(json.description && { description: json.description })
            },
            create: {
                ...(session.user.sub && { userId: session.user.sub }),
                ...(json.description && { description: json.description })
            }
        })
        return NextResponse.json({
            message: "success",
            data: {
                profile,
            }
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "internal server error",
            error
        }, {
            status: 500
        })
    }

}