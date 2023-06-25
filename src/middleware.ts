export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/auth/new-user",
    "/profile/:path*"
  ],
}