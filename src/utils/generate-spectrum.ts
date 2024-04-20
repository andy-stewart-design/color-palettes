import { formatHex, converter, Okhsl } from "culori";
import { range } from "@/utils/arrays";
import { generateColorNames, generateColorName } from "@/utils/generate-color-names";

export const okhsl = converter("okhsl");

export async function generateSpectrum(
  hexParam: string,
  stepsParam: string,
  keyIndexParam: string | undefined
) {
  const keyColor = okhsl(hexParam);
  const stepsAsNumber = parseFloat(stepsParam);

  if (!keyColor) throw new Error("Invalid color");

  const keyHue = keyColor.h ?? 0;
  const keySaturation = keyColor.s;
  const keyLightness = keyColor.l;

  const numSteps = stepsAsNumber ? stepsAsNumber : 11;
  const lightnessDark = keyLightness < 0.12 ? keyLightness : 0.12;
  const lightnessBright = keyLightness > 0.94 ? keyLightness : 0.94;
  const lightnessRange = lightnessBright - lightnessDark;

  const keyIndexGenerated = generateKeyIndex({
    keyValue: keyLightness,
    min: lightnessDark,
    spread: lightnessRange,
    steps: numSteps,
  });

  const keyIndexCurrent = keyIndexParam ? parseInt(keyIndexParam) : keyIndexGenerated;

  const numStepsBeforeKey = keyIndexCurrent;
  const lowerRange = range(numStepsBeforeKey).map((index) => {
    const differential = lightnessBright - keyLightness;
    const step = differential / numStepsBeforeKey;
    return lightnessBright - index * step;
  });

  const numStepsAfterKey = numSteps - keyIndexCurrent - 1;
  const upperRange = range(numStepsAfterKey).map((index) => {
    const differential = keyLightness - lightnessDark;
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

  const name = (await generateColorName(colors[keyIndexCurrent])) as string;
  const intergerNames = generateColorNames(stepsAsNumber);

  return {
    colors: {
      raw: colorsRaw,
      hex: colorsHex,
      intergerName: intergerNames,
    },
    keyColor: {
      hex: hexParam,
      raw: keyColor,
      intergerName: intergerNames[keyIndexCurrent],
      name,
    },
    keyIndex: {
      current: keyIndexCurrent,
      generated: keyIndexGenerated,
    },
  };
}

// HELPER FUNCTIONS
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
