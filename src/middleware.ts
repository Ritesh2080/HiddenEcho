import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/sign-in") || 
                     pathname.startsWith("/sign-up") || 
                     pathname.startsWith("/verify");

  const isProtectedPage = pathname.startsWith("/dashboard");


  if (token && isAuthPage) {
    console.log("↩️ Redirecting to dashboard (logged in user on auth page)");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && isProtectedPage) {
    console.log("↩️ Redirecting to sign-in (no token on protected page)");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  console.log("✅ Allowing request to proceed");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/dashboard/:path*",
  ],
};