import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(req: NextRequest) {
  if (!getSessionCookie(req)) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("redirect", req.nextUrl.pathname);
    url.searchParams.set("reason", "protected");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/product/:path*", "/profile/:path*"] };
