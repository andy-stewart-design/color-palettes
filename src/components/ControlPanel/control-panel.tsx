"use client";

import { startTransition, useOptimistic } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HexController from "./HexController";
import HSLController from "./HSLController";
import { NumberInput } from "@/components/ds/inputs";
import { DEFAULTS, type SEARCH_PARAMS } from "@/app/constants";
import classes from "./component.module.css";

type PropTypes = {
  hex: string;
  hsl: string;
  idx: string;
  steps: string;
  min: string;
  max: string;
};

export default function ControlPanel(props: PropTypes) {
  const currentParams = props;

  const [currentValues, setCurrentValues] = useOptimistic(currentParams);
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  function handleChange(name: string, value: string) {
    const params = new URLSearchParams();
    let newParams = { ...currentValues, [name]: value };

    Object.entries(newParams).forEach(([key, value]) => {
      const param = key as SEARCH_PARAMS;
      if (value !== DEFAULTS.values[param]) params.set(key, value);
    });

    if (name === "hex") {
      params.delete("hsl");
    } else if (name === "hsl") {
      params.delete("hex");
    } else {
      const paramKeys = Object.keys(currentSearchParams) as Array<SEARCH_PARAMS>;
      if (!paramKeys.includes("hex")) params.delete("hex");
      if (!paramKeys.includes("hsl")) params.delete("hsl");

      if (name === "steps") {
        const stepsAsNumber = parseFloat(value);
        const idxAsNumber = parseFloat(currentValues.idx);
        if (idxAsNumber > stepsAsNumber) {
          params.set("idx", value);
          newParams = { ...currentValues, [name]: value, idx: value };
        }
      }
    }

    startTransition(() => {
      setCurrentValues(newParams);
      router.push(`/?${params.toString()}`);
    });
  }

  const [h, s, l] = currentValues.hsl.split("_");

  return (
    <div className={classes.sidebar}>
      <HexController name="hex" value={currentValues.hex} onChange={handleChange} />
      <HSLController h={h} s={s} l={l} onChange={handleChange} />
      <NumberInput
        name="idx"
        label="Key Index"
        value={currentValues.idx}
        min="3"
        max={props.steps}
        onChange={handleChange}
      />
      <NumberInput
        name="steps"
        value={currentValues.steps}
        min="3"
        max="19"
        onChange={handleChange}
      />
      <NumberInput
        name="min"
        label="Min Brightness"
        value={currentValues.min}
        min="5"
        max="20"
        onChange={handleChange}
      />
      <NumberInput
        name="max"
        label="Max Brightness"
        value={currentValues.max}
        min="85"
        max="99"
        onChange={handleChange}
      />
    </div>
  );
}
