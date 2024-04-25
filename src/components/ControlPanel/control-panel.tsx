"use client";

import { startTransition, useOptimistic } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HexController from "./HexController";
import HSLController from "./HSLController";
import { NumberInput } from "@/components/ds/inputs";
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
  const systemParams = { ...props, hex: props.hex.replace("#", "") };

  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const [optimisticParams, setOptimisticParams] = useOptimistic(systemParams);

  function handleChange(name: string, value: string) {
    const params = new URLSearchParams();
    let nextParams = { ...optimisticParams, [name]: value };

    if (name === "hex" || name === "hsl") {
      params.set(name, value);
    } else {
      Object.entries(nextParams).forEach(([key, value]) => {
        params.set(key, value);
      });

      if (currentSearchParams.get("hsl")) {
        params.delete("hex");
      } else {
        params.delete("hsl");
      }

      if (name === "steps") {
        const stepsAsNumber = parseFloat(value);
        const idxAsNumber = parseFloat(nextParams.idx);
        if (idxAsNumber + 1 >= stepsAsNumber) {
          params.set("idx", `${idxAsNumber - 1}`);
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
        max={props.steps}
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
        name="min"
        label="Min Brightness"
        value={optimisticParams.min}
        min="5"
        max="20"
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
    </div>
  );
}
