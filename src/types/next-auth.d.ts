import { JWT } from "next-auth/jwt"
import NextAuth, { DefaultSession } from "next-auth"
import { UserRole } from "@prisma/client"

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        fileKey?: string
        role: UserRole
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
            sub?: string
            role?: UserRole
        } & DefaultSession["user"]
    }
    interface User {
        role: UserRole
    }
}