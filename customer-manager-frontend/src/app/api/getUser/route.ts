import { jwtDecode } from "jwt-decode";
import { type NextRequest, NextResponse } from "next/server";
import { type JwtDecodedPayload } from "@/app/lib/definitions";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  try {
    if (accessToken) {
      const user = jwtDecode(accessToken) as JwtDecodedPayload;
      return Response.json({ user });
    }
    return Response.json({});
  } catch {
    return Response.json({});
  }
}
