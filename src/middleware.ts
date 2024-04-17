import { formatHex } from "culori";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const keyColorHex = request.nextUrl.searchParams.get("hex");
  if (keyColorHex) response.cookies.set("keyColor", keyColorHex);

  const keyColorHSL = request.nextUrl.searchParams.get("hsl");

  if (keyColorHSL) {
    const { h, s, l } = parseHSLParam(keyColorHSL);
    if (!h || !s || !l) return response;
    const newHex = formatHex({ mode: "okhsl", h, s, l });
    response.cookies.set("keyColor", newHex.replace("#", ""));
  }

  return response;
}

function parseHSLParam(param: string) {
  const [h, s, l] = param.split("_");
  const hue = parseFloat(h);
  const sat = parseFloat(s) / 100;
  const lit = parseFloat(l) / 100;

  if (typeof hue !== "number" || typeof sat !== "number" || typeof lit !== "number") {
    return { h: undefined, s: undefined, l: undefined };
  }

  return { h: hue, s: sat, l: lit };
}
