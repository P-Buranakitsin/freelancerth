import NextAuth from "next-auth/next";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";
import { NextAuthOptions } from "next-auth";
import { utapi } from "uploadthing/server";

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
        // Variable session is sent from client side
        async jwt({ token, user, trigger, session }) {
            if (trigger === "signIn") {
                token.role = user.role
            }
            if (trigger === "update") {
                // Note, that `session` can be any arbitrary object, remember to validate it!
                if (session?.name) {
                    token.name = session.name
                }
                if (session?.fileUrl) {
                    token.picture = session.fileUrl
                }
                if (session?.fileKey) {
                    if (token.fileKey) {
                        await utapi.deleteFiles(token.fileKey);
                    }
                    token.fileKey = session.fileKey
                }
                if (session?.role) {
                    token.role = session.role
                }

            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.user.fileKey = token.fileKey
            session.user.sub = token.sub
            session.user.role = token.role

            return session
        }

    },
    pages: {
        signIn: '/auth/signin',
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/auth/new-user',
        error: '/auth/error', // Error code passed in query string as ?error=
    },
    secret: process.env.NEXTAUTH_SECRET
}


const handler = NextAuth(authOptions);


export { handler as GET, handler as POST }