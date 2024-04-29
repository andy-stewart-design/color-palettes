import { cookies } from "next/headers";
import { formatHex } from "culori";
import ControlPanel from "@/components/ControlPanel";
import { generateSpectrum, okhsl } from "@/utils/generate-spectrum";
import { DEFAULTS } from "./constants";
import classes from "./page.module.css";
import { generateCSSVariables } from "@/utils/generate-css-vars";
import ColorGrid from "@/components/ColorGrid";

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
  const hexParam = getKeyHexValue(searchParams);
  const hslParam = searchParams.hsl;
  const keyIndexParam = searchParams.idx;
  const stepsParam = searchParams.steps ?? DEFAULTS.values.steps;
  const maxLightParam = searchParams.max;
  const minLightParam = searchParams.min;

  const keyColorInit = getKeyColor({ hex: hexParam, hsl: hslParam });
  const colorObject = await generateSpectrum({
    hex: keyColorInit.hex,
    steps: stepsParam,
    index: keyIndexParam,
    min: minLightParam,
    max: maxLightParam,
  });
  const { colors, keyColor, keyIndex, lightness } = colorObject;

  const primitiveVariables = generateCSSVariables({ type: "primitive", colors });
  const semanticVariables = generateCSSVariables({ type: "semantic", color: keyColor });
  const cssVariables = { ...primitiveVariables, ...semanticVariables };

  const nextHSL = `${keyColorInit.h}_${keyColorInit.s}_${keyColorInit.l}`;
  const nextSteps = {
    default: DEFAULTS.values.steps,
    current: stepsParam,
  };

  return (
    <main className={classes.main} style={cssVariables}>
      <ControlPanel
        hex={keyColor.hex}
        hsl={nextHSL}
        idx={keyIndex}
        steps={nextSteps}
        min={lightness.min}
        max={lightness.max}
      />
      <ColorGrid colors={colors.hex} names={colors.intergerName} />
    </main>
  );
}

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

function getKeyColor({ hex, hsl }: { hex?: string; hsl?: string }) {
  if (hsl !== undefined) {
    const { h, s, l } = parseHSLParam(hsl);

    if (h === undefined || s === undefined || l === undefined) {
      const error = `HSL query param is improperly formatted. Expected three numbers separated by an underscore (e.g. 0_0_0). Received: ${hsl}`;
      throw new Error(error);
    }

    const newHex = formatHex({ mode: "okhsl", h, s, l });
    return { hex: newHex, h: h.toString(), s: (s * 100).toString(), l: (l * 100).toString() };
  } else if (hex !== undefined) {
    const newColor = okhsl(hex);

    if (!newColor) {
      const error = `There was an error converting the given hex value (${hex}) into OKHSL`;
      throw new Error(error);
    }

    const { h: hue, s: sat, l: lit } = newColor;
    const h = (hue ?? 0).toString();
    const s = (sat * 100).toString();
    const l = (lit * 100).toString();
    return { hex, h, s, l };
  } else {
    const error = "Could not generate a key color because both hex and hsl values were undefined.";
    throw new Error(error);
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
