import { jwtDecode } from "jwt-decode";
import { type NextRequest } from "next/server";
import { type JwtDecodedPayload } from "@/app/lib/definitions";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  try {
    if (accessToken) {
      const accessTokenDecode = jwtDecode(accessToken) as JwtDecodedPayload;
      const user = accessTokenDecode;

      return Response.json({ user });
    }
    return Response.json({});
  } catch {
    return Response.json({});
  }
}
