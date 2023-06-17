import NextAuth from "next-auth/next";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";
import { NextAuthOptions } from "next-auth";
import { UpdatedUserSession } from "@/app/auth/new-user/page";

export const authOptions: NextAuthOptions =
{
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: 'jwt'
    },
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
        })
    ],
    callbacks: {
        // Using the `...rest` parameter to be able to narrow down the type based on `trigger`
        jwt({ token, trigger, session }) {
            const sessionTyped: UpdatedUserSession = session
            if (trigger === "update" && session?.name) {
                // Note, that `session` can be any arbitrary object, remember to validate it!
                token.name = sessionTyped.name
                if (session?.fileUrl) {
                    token.picture = sessionTyped.fileUrl
                }
            }
            return token
        }
    },
    pages: {
        signIn: '/auth/signin',
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/auth/new-user'
    },
    secret: process.env.NEXTAUTH_SECRET
}


const handler = NextAuth(authOptions);


export { handler as GET, handler as POST }