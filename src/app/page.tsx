// TODO: finish setting up control panel with number inputs
// TODO: add logic to generate color palettes
// TODO: test out more color formats

import HSLForm from "@/components/HSLForm";
import HexForm from "@/components/HexForm";
import TestSlider from "@/components/test-slider";
import { converter, formatHex } from "culori";
import { cookies } from "next/headers";

let okhsl = converter("okhsl");

type PageSearchParams = { hex?: string; h?: string; s?: string; l?: string; test?: string };

type PageProps = {
  searchParams: PageSearchParams;
};

export default async function Home({ searchParams }: PageProps) {
  // await new Promise((res) => setTimeout(res, 1000));
  const hex = getKeyColorRequest(searchParams);

  const h = searchParams.h ? parseInt(searchParams.h) : undefined;
  const s = searchParams.s ? parseInt(searchParams.s) : undefined;
  const l = searchParams.l ? parseInt(searchParams.l) : undefined;

  const keyColor = getKeyColor({ hex, h, s, l });

  if (!keyColor.hex) throw new Error("Something went wrong");

  const defaultTestValue = searchParams.test ? parseInt(searchParams.test) : 5;

  return (
    <main>
      <HexForm hex={keyColor.hex} key={keyColor.hex} />
      <HSLForm h={keyColor.h} s={keyColor.s} l={keyColor.l} />
      <TestSlider dv={defaultTestValue} />
      <div
        style={{ backgroundColor: keyColor.hex, height: "100px", transition: "all 200ms" }}
      ></div>
    </main>
  );
}

type GetKeyColorParams = {
  hex: string | undefined;
  h: number | undefined;
  s: number | undefined;
  l: number | undefined;
};
function getKeyColor({ hex, h, s, l }: GetKeyColorParams) {
  const isHSL = h !== undefined && s !== undefined && l !== undefined;

  if (isHSL) {
    const hsl = { h, s: s / 100, l: l / 100 };
    const newHex = formatHex({ mode: "okhsl", ...hsl });
    return { hex: newHex, h, s, l };
  } else {
    const foobar = hex;
    const newColor = okhsl(foobar);

    if (!newColor) return { error: "Something went wrong" };

    const { h: hue, s: sat, l: lit } = newColor;
    return { hex: foobar, h: hue ?? 0, s: sat * 100, l: lit * 100 };
  }
}

function getKeyColorRequest(searchParams: PageSearchParams) {
  const keyColorParam = searchParams.hex ? `#${searchParams.hex}` : undefined;
  if (keyColorParam) return keyColorParam;

  const keyColorCookie = cookies().get("keyColor");
  if (keyColorCookie) return `#${keyColorCookie.value}`;

  return "#B4D455";
}
