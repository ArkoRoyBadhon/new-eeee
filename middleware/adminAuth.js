import { NextResponse } from "next/server";

export async function middleware(req) {
  const token =
    req.cookies.get("adminToken")?.value || localStorage.getItem("adminToken");
  const { pathname } = req.nextUrl;

  // Allow login page
  if (pathname.startsWith("/admin/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const verifyUrl = new URL("/api/admin/verify", req.nextUrl.origin);
      const response = await fetch(verifyUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      // Clear both cookie and localStorage
      response.cookies.delete("adminToken");
      if (typeof window !== "undefined") {
        localStorage.removeItem("adminToken");
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
