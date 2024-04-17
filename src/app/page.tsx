// TODO: add logic to generate color palettes
// TODO: test out more color formats

import { cookies } from "next/headers";
import { converter, formatHex } from "culori";
import ControlPanel from "@/components/ControlPanel";
import { DEFAULTS } from "./constants";
import classes from "./page.module.css";

let okhsl = converter("okhsl");

type PageSearchParams = {
  hex?: string;
  hsl?: string;
  idx?: string;
  steps?: string;
  max?: string;
  min?: string;
};

type PageProps = {
  searchParams: PageSearchParams;
};

export default async function Home({ searchParams }: PageProps) {
  const hex = getKeyHexValue(searchParams);
  const hsl = searchParams.hsl;
  const keyIndex = searchParams.idx ? searchParams.idx : DEFAULTS.values.idx;
  const steps = searchParams.steps ? searchParams.steps : DEFAULTS.values.steps;
  const maxBrightness = searchParams.max ? searchParams.max : DEFAULTS.values.max;
  const minBrightness = searchParams.min ? searchParams.min : DEFAULTS.values.min;

  const keyColor = getKeyColor({ hex, hsl });
  if ("error" in keyColor) throw new Error(keyColor.error);
  const newHSL = `${keyColor.h}_${keyColor.s}_${keyColor.l}`;

  return (
    <main className={classes.main}>
      <ControlPanel
        hex={keyColor.hex}
        hsl={newHSL}
        idx={keyIndex}
        steps={steps}
        max={maxBrightness}
        min={minBrightness}
      />
      <div style={{ backgroundColor: keyColor.hex, transition: "all 200ms" }} />
    </main>
  );
}

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

type GetKeyColorParams = {
  hex: string | undefined;
  hsl: string | undefined;
};

interface GetKeyColorError {
  error: string;
}

interface GetKeyColorValue {
  hex: string;
  h: string;
  s: string;
  l: string;
}

type GetKeyColorReturn = GetKeyColorError | GetKeyColorValue;

function getKeyColor({ hex, hsl }: GetKeyColorParams): GetKeyColorReturn {
  if (hsl !== undefined) {
    const { h, s, l } = parseHSLParam(hsl);

    if (h === undefined || s === undefined || l === undefined) {
      return {
        error: `HSL query param is improperly formatted. Expected three numbers separated by an underscore (e.g. 0_0_0). Received: ${hsl}`,
      };
    }

    const newHex = formatHex({ mode: "okhsl", h, s, l });
    return { hex: newHex, h: h.toString(), s: (s * 100).toString(), l: (l * 100).toString() };
  } else if (hex !== undefined) {
    const newColor = okhsl(hex);

    if (!newColor) {
      return { error: `There was an error converting the given hex value (${hex}) into OKHSL` };
    }

    const { h: hue, s: sat, l: lit } = newColor;
    const h = (hue ?? 0).toString();
    const s = (sat * 100).toString();
    const l = (lit * 100).toString();
    return { hex, h, s, l };
  } else {
    return { error: "No key color found" };
  }
}

function getKeyHexValue(searchParams: PageSearchParams) {
  const keyColorParam = searchParams.hex ? `#${searchParams.hex}` : undefined;
  if (keyColorParam) return keyColorParam;

  const keyColorCookie = cookies().get("keyColor");
  if (keyColorCookie) return `#${keyColorCookie.value}`;

  return DEFAULTS.values.hex;
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
