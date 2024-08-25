import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { JwtDecodedPayload } from "@/app/lib/definitions";

const privatePaths = ["/dashboard"];
const authPaths = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessTokenFromRequest = request.cookies?.get("accessToken")?.value;
  const refreshTokenFromRequest = request.cookies?.get("refreshToken")?.value;

  //Check if login require
  if (privatePaths.some((path) => pathname.startsWith(path))) {
    if (!accessTokenFromRequest && !refreshTokenFromRequest) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    //refresh tokens
    if (!accessTokenFromRequest && refreshTokenFromRequest) {
      try {
        const url = process.env.BACKEND_URL + "/auth/refresh";
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            refreshToken: refreshTokenFromRequest,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const parsedRes = await res.json();

        const { accessToken, refreshToken } = parsedRes;

        const accessTokenDecode = jwtDecode(accessToken);

        const refreshTokenDecode = jwtDecode(refreshToken);

        const response = NextResponse.redirect(request.nextUrl);

        response.cookies.set({
          name: "accessToken",
          value: accessToken,
          secure: false,
          httpOnly: true,
          expires: new Date(accessTokenDecode.exp! * 1000),
        });

        response.cookies.set({
          name: "refreshToken",
          value: refreshToken,
          secure: false,
          httpOnly: true,
          expires: new Date(refreshTokenDecode.exp! * 1000),
        });

        return response;
      } catch {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    //admin route
    if (accessTokenFromRequest && pathname.includes("admin")) {
      const accessTokenFromRequestDecode = jwtDecode(
        accessTokenFromRequest
      ) as JwtDecodedPayload;
      if (accessTokenFromRequestDecode?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  //Redirect dash board if already login
  if (authPaths.some((path) => pathname.startsWith(path))) {
    const accessTokenFromCookie = request.cookies?.get("accessToken")?.value;

    const response = NextResponse.next();
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    if (accessTokenFromCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  // matcher: ["/dashboard", "/login"],
  matcher: [...privatePaths, ...authPaths],
};