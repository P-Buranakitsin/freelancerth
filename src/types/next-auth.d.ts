import { JWT } from "next-auth/jwt"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        fileKey?: string
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            fileKey?: string
        } & DefaultSession["user"]
    }
}