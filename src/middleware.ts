import { formatHex } from "culori";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const keyColorHex = request.nextUrl.searchParams.get("hex");

  let response = NextResponse.next();

  if (keyColorHex) response.cookies.set("keyColor", keyColorHex);

  const keyColorH = request.nextUrl.searchParams.get("h");

  if (keyColorH) {
    const keyColorS = request.nextUrl.searchParams.get("s");
    const keyColorL = request.nextUrl.searchParams.get("l");

    if (!keyColorS || !keyColorL) return response;

    const hsl = {
      h: parseInt(keyColorH),
      s: parseInt(keyColorS) / 100,
      l: parseInt(keyColorL) / 100,
    };
    const newHex = formatHex({ mode: "okhsl", ...hsl });
    response.cookies.set("keyColor", newHex.replace("#", ""));
  }

  return response;
}
