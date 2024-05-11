import { range } from "@/utils/arrays";
import { generateColorNames, generateColorName } from "@/utils/generate-color-names";
import { DEFAULTS } from "@/constants";
import { okhsl, formatHex } from "./culori";
import type { Okhsl } from "culori";

interface GenerateSpectrumProps {
  hex: string;
  steps: string;
  index: string | undefined;
  min: string | undefined;
  max: string | undefined;
}

export async function generateSpectrum(systemParams: GenerateSpectrumProps) {
  const keyColor = okhsl(systemParams.hex);

  if (!keyColor) throw new Error("Invalid color");

  const keyHue = keyColor.h ?? 0;
  const keySaturation = keyColor.s;
  const keyLightness = keyColor.l;

  const numSteps = parseFloat(systemParams.steps);
  const lightnessMin = generateMin(systemParams.min, keyLightness);
  const lightnessMax = generateMax(systemParams.max, keyLightness);
  const lightnessRange = lightnessMax - lightnessMin;

  const keyIndexGenerated = generateKeyIndex({
    keyValue: keyLightness,
    min: lightnessMin,
    spread: lightnessRange,
    steps: numSteps,
  });

  const keyIndexCurrent = systemParams.index ? parseInt(systemParams.index) : keyIndexGenerated;

  const numStepsBeforeKey = keyIndexCurrent;
  const lowerRange = range(numStepsBeforeKey).map((index) => {
    const differential = lightnessMax - keyLightness;
    const step = differential / numStepsBeforeKey;
    return lightnessMax - index * step;
  });

  const numStepsAfterKey = numSteps - keyIndexCurrent - 1;
  const upperRange = range(numStepsAfterKey).map((index) => {
    const differential = keyLightness - lightnessMin;
    const step = differential / numStepsAfterKey;
    return keyLightness - (index + 1) * step;
  });

  const lightnessValues = [...lowerRange, keyLightness, ...upperRange];

  const colorsRaw: Array<Okhsl> = lightnessValues.map((lightness) => ({
    mode: "okhsl",
    h: keyHue,
    s: keySaturation,
    l: lightness,
  }));

  const colorsHex = colorsRaw.map((color) => {
    return formatHex(color);
  });

  const colors = lightnessValues.map((lightness) => {
    return formatHex({
      mode: "okhsl",
      h: keyHue,
      s: keySaturation,
      l: lightness,
    });
  });

  const name = await generateColorName(colors[keyIndexCurrent]);
  const intergerNames = generateColorNames(numSteps);

  return {
    colors: {
      raw: colorsRaw,
      hex: colorsHex,
      intergerName: intergerNames,
    },
    keyColor: {
      hex: systemParams.hex,
      raw: keyColor,
      intergerName: intergerNames[keyIndexCurrent],
      name,
    },
    keyIndex: {
      current: keyIndexCurrent.toString(),
      default: keyIndexGenerated.toString(),
    },
    lightness: {
      min: (lightnessMin * 100).toString(),
      max: (lightnessMax * 100).toString(),
    },
  };
}

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------
interface GenerateKeyIndexProps {
  steps: number;
  spread: number;
  min: number;
  keyValue: number;
}

function generateKeyIndex(props: GenerateKeyIndexProps) {
  let keyIndex: number | undefined;

  const stepArray = range(props.steps).reverse();

  const lightnessRanges = stepArray.map((index) => {
    const spread = props.spread / props.steps;
    const lower = index * spread + props.min;
    const upper = (index + 1) * spread + props.min;
    return [upper, lower];
  });

  lightnessRanges.forEach(([upper, lower], index) => {
    if (props.keyValue >= lower && props.keyValue <= upper) {
      keyIndex = index;
    }
  });

  if (keyIndex === undefined) keyIndex = 0;
  return keyIndex;
}

function generateMin(param: string | undefined, generated: number) {
  const defaultAsNumber = parseFloat(DEFAULTS.min) / 100;
  if (param) return parseFloat(param) / 100;
  else if (generated < defaultAsNumber) return generated;
  else return defaultAsNumber;
}

function generateMax(param: string | undefined, generated: number) {
  const defaultAsNumber = parseFloat(DEFAULTS.max) / 100;
  if (param) return parseFloat(param) / 100;
  else if (generated > defaultAsNumber) return generated;
  else return defaultAsNumber;
}
