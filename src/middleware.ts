import { formatHex } from "culori";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SearchParamsSchema } from "@/constants";

export function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const searchParamsObject = Object.fromEntries(request.nextUrl.searchParams);
  const searchParams = SearchParamsSchema.parse(searchParamsObject);

  const keyColorHex = searchParams.hex;
  if (keyColorHex) response.cookies.set("keyColor", keyColorHex);

  const hueParam = searchParams.hue;
  const saturationParam = searchParams.saturation;
  const lightnessParam = searchParams.lightness;

  if (hueParam && saturationParam && lightnessParam) {
    const h = parseFloat(hueParam);
    const s = parseFloat(saturationParam) / 100;
    const l = parseFloat(lightnessParam) / 100;
    const newHex = formatHex({ mode: "okhsl", h, s, l });
    response.cookies.set("keyColor", newHex.replace("#", ""));
  }

  return response;
}
