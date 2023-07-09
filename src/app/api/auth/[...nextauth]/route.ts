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
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
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
            if (trigger === "signIn" || trigger === "signUp") {
                token.role = user.role;
            }

            if (trigger === "update" && session) {
                const { name, fileUrl, fileKey, role } = session;

                if (name) token.name = name;
                if (fileUrl) token.picture = fileUrl;
                if (role) token.role = role;

                if (fileKey) {
                    if (token.fileKey) {
                        await utapi.deleteFiles(token.fileKey);
                    }
                    token.fileKey = fileKey;
                }
            }

            return token;
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