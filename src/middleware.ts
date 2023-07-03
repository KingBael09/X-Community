import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req })

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const connfig = {
  matcher: ["/x:/:path*/submit", "/x/create", "/settings"],
}
