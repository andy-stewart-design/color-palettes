"use client";

import { CSSProperties, useState } from "react";
import { useFormState } from "react-dom";
import { converter, formatCss, formatHex } from "culori";

type Hsl = ReturnType<typeof hsl>;

interface HslParams {
  name: "hue" | "saturation" | "lightness";
  value: number;
}

interface HexParams {
  name: "hex";
  value: string;
}

interface KeyColor {
  hex: string;
  hsl: Hsl;
}

const converterHSL = converter("hsl");

function hsl(color: string) {
  const colorHSL = converterHSL(color);
  if (!colorHSL) throw new Error(`Invalid color: ${color}`);

  const { h, s, l, mode } = colorHSL;
  if (h === undefined) throw new Error(`Invalid color: ${color}`);

  return { h, s, l, mode };
}

function App() {
  const [state, formAction] = useFormState((previousState: number, formData: FormData) => {
    console.log(previousState, formData.get("foo"), formData.get("test"));

    return 0;
  }, 0);

  const [currentColor, setCurrentColor] = useState<KeyColor>(() => ({
    hex: "#43c5ef",
    hsl: hsl("#43c5ef"),
  }));

  const lightnessArray = createLinearDistribution(currentColor.hsl.l, 11, 0.05, 0.9);

  const chromaArray = createParabolicDistribution(
    lightnessArray.range.length,
    Math.max(0, currentColor.hsl.s - (currentColor.hsl.s / 16) * lightnessArray.keyIndex),
    currentColor.hsl.s,
    lightnessArray.keyIndex - Math.floor(lightnessArray.range.length / 2)
  );

  function updateCurrentColor({ name, value }: HslParams | HexParams) {
    if (name === "saturation" || name === "lightness" || name === "hue") {
      const key = name[0];
      const hsl = { ...currentColor.hsl, [key]: value };

      setCurrentColor((current) => {
        return {
          hex: formatHex(hsl),
          hsl: { ...current.hsl, [key]: value },
        };
      });
    } else if (name === "hex") {
      const hex = value.startsWith("#") ? value : `#${value}`;
      setCurrentColor({
        hex: value,
        hsl: hsl(value),
      });
    }
  }

  function handleHexInput(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.toUpperCase();
    value = value.replace(/[^0-9A-F]/g, "");
    value = value.slice(0, 6);
    e.target.value = value;
  }

  return (
    <>
      <header>
        <form action={formAction}>
          <div>
            <span style={{ opacity: 0.4 }}>#</span>
            <input name="test" onChange={handleHexInput} />
          </div>
          <input
            type="range"
            name="foo"
            onChange={(e) => (e.target.parentElement as HTMLFormElement).requestSubmit()}
          />
        </form>
        <div>
          <p className="swatch">
            <span style={{ background: currentColor.hex }} />
            <input type="text" value={currentColor.hex} readOnly />
          </p>
        </div>
        <div className="slider">
          <label>
            <span>Hue</span>
            <input
              type="range"
              name="hue"
              value={currentColor.hsl.h}
              onChange={(e) =>
                updateCurrentColor({
                  name: "hue",
                  value: e.target.valueAsNumber,
                })
              }
              min={0}
              max={360}
              step={0.1}
            />
          </label>
        </div>
        <div className="slider">
          <label>
            <span>Saturation</span>
            <input
              type="range"
              name="saturation"
              value={currentColor.hsl.s}
              onChange={(e) => {
                updateCurrentColor({
                  name: "saturation",
                  value: e.target.valueAsNumber,
                });
              }}
              min={0}
              max={1}
              step={0.01}
            />
          </label>
        </div>
        <div className="slider">
          <label>
            <span>Lightness</span>
            <input
              type="range"
              name="lightness"
              value={currentColor.hsl.l}
              onChange={(e) =>
                updateCurrentColor({
                  name: "lightness",
                  value: e.target.valueAsNumber,
                })
              }
              min={0}
              max={1}
              step={0.01}
            />
          </label>
        </div>
      </header>
      <main>
        {lightnessArray.range.map((value, index) => (
          <div
            className="color-card"
            key={value}
            style={
              {
                backgroundColor: formatCss({
                  mode: "hsl",
                  h: currentColor.hsl.h,
                  l: value,
                  s: chromaArray[index],
                }),
                "--saturation": `${chromaArray[index] * 100}%`,
                "--lightness": `${value * 100}%`,
              } as CSSProperties
            }
          >
            <ul>
              <li>
                {formatHex({
                  mode: "hsl",
                  h: currentColor.hsl.h,
                  l: value,
                  s: chromaArray[index],
                })}
              </li>
              <li>h: {roundTo(currentColor.hsl.h, 1)}</li>
              <li>s: {roundTo(chromaArray[index])}</li>
              <li>l: {roundTo(value)}</li>
            </ul>
            <div className="indicators">
              {/* <span className="indicator saturation"></span> */}
              <span
                className={`indicator lightness ${
                  index === lightnessArray.keyIndex ? "anchor" : ""
                }`.trim()}
              />
              <span
                className={`indicator saturation ${
                  index === lightnessArray.keyIndex ? "anchor" : ""
                }`.trim()}
              />
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

export default App;

function createLinearDistribution(
  seed: number | null,
  length = 11,
  min = 0.1,
  max = 0.95
): {
  range: number[];
  keyIndex: number;
} {
  if (seed === null) {
    // Create an ideal linear didtribution given the desired length, min and max values
    return {
      range: Array.from({ length }, (_, i) => {
        return min + (i * (max - min)) / (length - 1);
      }),
      keyIndex: -1,
    };
  }

  const params = getLinearDistributionParams(seed, length, min, max);

  const lowerSteps = params.keyIndex;
  const lowerStep = (params.keyValue - params.min) / lowerSteps;
  const upperSteps = length - 1 - params.keyIndex;
  const upperStep = (params.max - params.keyValue) / upperSteps;

  if (params.keyIndex === 0 || params.keyIndex === length - 1) {
    const numSteps = params.keyIndex === 0 ? upperSteps : lowerSteps;
    const step = params.keyIndex === 0 ? upperStep : lowerStep;

    return {
      range: new Array(numSteps + 1).fill(0).map((_, i) => {
        return roundTo(params.min + i * step);
      }),
      keyIndex: params.keyIndex,
    };
  } else {
    const lowerArray = new Array(lowerSteps).fill(0).map((_, i) => {
      return roundTo(params.min + i * lowerStep);
    });

    const upperArray = new Array(upperSteps + 1).fill(0).map((_, i) => {
      return roundTo(params.keyValue + i * upperStep);
    });

    return {
      range: [...lowerArray, ...upperArray],
      keyIndex: params.keyIndex,
    };
  }
}

function getLinearDistributionParams(seed: number, length = 11, min = 0.1, max = 0.95) {
  const idealDistribution = createLinearDistribution(null, length, min, max);

  const parameters = idealDistribution.range.reduce(
    (acc, value, index) => {
      if (index === 0) {
        if (seed <= value) return { keyIndex: 0, min: seed, max };
      } else if (index === length - 1) {
        if (acc.keyIndex > -1) return acc;
        else
          return {
            ...acc,
            keyIndex: length - 1,
            max: seed,
          };
      }

      const nextValue = idealDistribution.range[index + 1];

      if (seed >= value && seed < nextValue) {
        const lowerDist = seed - value;
        const upperDist = nextValue - seed;

        if (lowerDist <= upperDist) return { ...acc, keyIndex: index };
        else return { ...acc, keyIndex: index + 1 };
      }

      return acc;
    },
    { keyIndex: -1, min, max }
  );

  return { ...parameters, keyValue: seed };
}

function createParabolicDistribution(
  arrayLength: number,
  minValue: number = 0,
  maxValue: number = 1,
  shift: number = 0
): number[] {
  const output: number[] = new Array(arrayLength);
  const range = maxValue - minValue;

  // Calculate the peak index (shifted)
  const peakIndex = Math.min(
    Math.max(Math.floor((arrayLength - 1) / 2) + shift, 0),
    arrayLength - 1
  );

  if (peakIndex === 0) {
    return new Array(arrayLength).fill(roundTo(minValue + range, 4));
  }

  for (let i = 0; i < arrayLength; i++) {
    let normalizedValue: number;

    if (i <= peakIndex) {
      // Linear increase to peak
      normalizedValue = i / peakIndex;
    } else {
      // Linear decrease from peak
      normalizedValue = 1 - (i - peakIndex) / (arrayLength - 1 - peakIndex);
      normalizedValue = 1;
    }

    // Ensure normalizedValue is within [0, 1]
    normalizedValue = Math.max(0, Math.min(1, normalizedValue));

    // Scale to the desired range and round
    output[i] = roundTo(minValue + normalizedValue * range, 4);
  }

  return output;
}

function roundTo(num: number, digits = 3): number {
  return Number(num.toFixed(digits));
}

// function applyEasing(array: number[]) {
//   const originalArray = [...array];
//   const originalArraySorted = [...originalArray].sort();
//   const originalMin = originalArraySorted[0];
//   const originalMax = originalArraySorted[originalArraySorted.length - 1];

//   const easedArray = array.map((value) => {
//     return ease(value);
//   });
//   const easedArraySorted = [...easedArray].sort();
//   const easedMin = easedArraySorted[0];
//   const easedMax = easedArraySorted[easedArraySorted.length - 1];

//   const mappedEasedArray = easedArray.map((value) => {
//     return map(value, easedMin, easedMax, originalMin, originalMax);
//   });

//   return mappedEasedArray;
// }

// function ease(x: number) {
//   return x * x * x * x * x;
// }

// function map(
//   x: number,
//   in_min: number,
//   in_max: number,
//   out_min: number,
//   out_max: number
// ) {
//   return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
// }
