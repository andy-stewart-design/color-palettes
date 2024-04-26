"use client";

import { startTransition, useOptimistic } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HexController from "./HexController";
import HSLController from "./HSLController";
import { NumberInput } from "@/components/ds/inputs";
import classes from "./component.module.css";
import { DEFAULTS, SEARCH_PARAMS } from "@/app/constants";

type PropTypes = {
  hex: string;
  hsl: string;
  idx: { default: string; current: string };
  steps: { default: string; current: string };
  min: string;
  max: string;
};

export default function ControlPanel(props: PropTypes) {
  const systemParams = formatParams(props);
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const [optimisticParams, setOptimisticParams] = useOptimistic(systemParams);

  function handleChange(name: string, value: string) {
    const params = new URLSearchParams();
    let nextParams = { ...optimisticParams, [name]: value };

    if (name === DEFAULTS.params.hex || name === DEFAULTS.params.hsl) {
      const currentSteps = currentSearchParams.get(DEFAULTS.params.steps);
      params.set(name, value);
      if (currentSteps) params.set(DEFAULTS.params.steps, currentSteps);
    } else {
      Object.entries(nextParams).forEach(([key, value]) => {
        const param = key as SEARCH_PARAMS;
        const systemValue = props[param];
        if (typeof systemValue === "object") {
          if (value !== systemValue.default) {
            params.set(key, value);
          }
        } else params.set(key, value);
      });

      if (currentSearchParams.get(DEFAULTS.params.hsl)) {
        params.delete(DEFAULTS.params.hex);
      } else {
        params.delete(DEFAULTS.params.hsl);
      }

      if (name === DEFAULTS.params.steps) {
        const stepsAsNumber = parseFloat(value);
        const idxAsNumber = parseFloat(nextParams.idx);

        if (idxAsNumber + 1 >= stepsAsNumber) {
          params.set(DEFAULTS.params.idx, `${idxAsNumber - 1}`);
          nextParams = { ...optimisticParams, [name]: value, idx: value };
        }
      }
    }

    startTransition(() => {
      setOptimisticParams(nextParams);
      router.push(`/?${params.toString()}`);
    });
  }

  const [h, s, l] = optimisticParams.hsl.split("_");

  return (
    <div className={classes.sidebar}>
      <HexController name="hex" value={optimisticParams.hex} onChange={handleChange} />
      <HSLController h={h} s={s} l={l} onChange={handleChange} />
      <NumberInput
        name="idx"
        label="Key Index"
        value={optimisticParams.idx}
        min="0"
        max={props.steps.current}
        onChange={handleChange}
      />
      <NumberInput
        name="steps"
        value={optimisticParams.steps}
        min="3"
        max="19"
        onChange={handleChange}
      />
      <NumberInput
        name="max"
        label="Max Brightness"
        value={optimisticParams.max}
        min="85"
        max="99"
        onChange={handleChange}
      />
      <NumberInput
        name="min"
        label="Min Brightness"
        value={optimisticParams.min}
        min="5"
        max="20"
        onChange={handleChange}
      />
    </div>
  );
}

function formatParams(systemParams: PropTypes) {
  const systemParamsArray = Object.entries(systemParams);
  const currentParamsArray = systemParamsArray.map(([key, value]) => {
    if (typeof value === "object") {
      return [key, value.current];
    } else if (key === DEFAULTS.params.hex) {
      return [key, value.replace("#", "")];
    } else {
      return [key, value];
    }
  });
  return Object.fromEntries(currentParamsArray) as Record<SEARCH_PARAMS, string>;
}
