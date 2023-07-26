export { default } from "next-auth/middleware"

export const config = {
  // These urls are not accessible if not logged in
  matcher: [
    "/auth/new-user",
    "/profile/:path*",
    "/create-gig",
    "/register/freelancer",
    "/cart/gigs/:path*",
    "/order/history/:path*",
    "/customer-order/:path*"
  ],
}