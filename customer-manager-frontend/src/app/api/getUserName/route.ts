import { jwtDecode } from "jwt-decode";
import { type NextRequest } from "next/server";
import { type JwtDecodedPayload } from "@/app/lib/definitions";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  try {
    if (accessToken) {
      const accessTokenDecode = jwtDecode(accessToken) as JwtDecodedPayload;
      const userName = accessTokenDecode?.name;

      return Response.json({ userName });
    }
    return Response.json({ userName: "N/A" });
  } catch {
    return Response.json({ userName: "N/A" });
  }
}
