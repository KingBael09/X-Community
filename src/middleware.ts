export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/x/:path*/submit", "/x/create", "/settings"],
}
