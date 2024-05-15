// TODO: Style the form

import { cookies } from "next/headers";
import ControlPanel from "@/components/ControlPanel";
import ColorGrid from "@/components/ColorGrid";
import { generateSpectrum } from "@/utils/generate-spectrum";
import { DEFAULTS, SearchParamsSchema, type SearchParams } from "../constants";
import { generateCSSVariables } from "@/utils/generate-css-vars";
import { generateKeyColorServer } from "@/utils/generate-key-color";
import classes from "./page.module.css";

type PageProps = {
  searchParams: SearchParams;
};

export default async function Home({ searchParams }: PageProps) {
  const params = SearchParamsSchema.parse(searchParams);
  const hexParam = getKeyHexValue(params);
  const hueParam = params.hue;
  const satParam = params.saturation;
  const litParam = params.lightness;
  const stepsParam = params.steps ?? DEFAULTS.steps;
  const keyIndexParam = params.index;
  const maxLightParam = params.max;
  const minLightParam = params.min;

  const colorValues = generateKeyColorServer({
    hex: hexParam,
    hue: hueParam,
    saturation: satParam,
    lightness: litParam,
  });

  const colorObject = await generateSpectrum({
    hex: colorValues.hex,
    steps: stepsParam,
    index: keyIndexParam,
    min: minLightParam,
    max: maxLightParam,
  });

  const { colors, keyColor, keyIndex } = colorObject;

  const primitiveVariables = generateCSSVariables({ type: "primitive", colors });
  const semanticVariables = generateCSSVariables({ type: "semantic", color: keyColor });
  const cssVariables = { ...primitiveVariables, ...semanticVariables };

  return (
    <main className={classes.main} style={{ ...cssVariables }}>
      <ControlPanel
        hex={colorValues.hex}
        hue={colorValues.hue}
        saturation={colorValues.saturation}
        lightness={colorValues.lightness}
        steps={stepsParam}
        index={keyIndex}
      />
      <ColorGrid colors={colors.hex} names={colors.intergerName} keyIndex={keyIndex} />
    </main>
  );
}

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

function getKeyHexValue(searchParams: SearchParams) {
  const keyColorParam = searchParams.hex ? `#${searchParams.hex}` : undefined;
  if (keyColorParam) return keyColorParam;

  const keyColorCookie = cookies().get("keyColor");
  if (keyColorCookie) return `#${keyColorCookie.value}`;

  return DEFAULTS.hex;
}
