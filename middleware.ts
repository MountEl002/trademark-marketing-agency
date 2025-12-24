import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");

  return NextResponse.next();
}

export const config = {
  matcher: "/customer/:path*",
};
