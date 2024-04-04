"use client";

import { startTransition, useOptimistic, type ChangeEvent, type ComponentProps } from "react";
import { useRouter } from "next/navigation";

type PropTypes = {
  h: number;
  s: number;
  l: number;
};

export default function HSLForm({ h: defaultH, s: defaultS, l: defaultL }: PropTypes) {
  const [hue, setHue] = useOptimistic(defaultH);
  const [sat, setSat] = useOptimistic(defaultS);
  const [lit, setLit] = useOptimistic(defaultL);
  const router = useRouter();

  function handleChange(type: "h" | "s" | "l", value: string, onChange: (value: number) => void) {
    const nextValue = parseInt(value);
    const nextHue = type === "h" ? nextValue : hue;
    const nextSat = type === "s" ? nextValue : sat;
    const nextLit = type === "l" ? nextValue : lit;

    const params = new URLSearchParams();
    params.set("h", nextHue.toString());
    params.set("s", nextSat.toString());
    params.set("l", nextLit.toString());

    startTransition(() => {
      onChange(nextValue);
      router.push(`/?${params.toString()}`);
    });
  }

  return (
    <div>
      <HSLSlider
        id="hue"
        label="H"
        onChange={(e) => handleChange("h", e.target.value, setHue)}
        value={hue}
        min={0}
        max={360}
      />
      <HSLSlider
        id="sat"
        label="S"
        onChange={(e) => handleChange("s", e.target.value, setSat)}
        value={sat}
        min={0}
        max={100}
      />
      <HSLSlider
        id="lit"
        label="L"
        onChange={(e) => handleChange("l", e.target.value, setLit)}
        value={lit}
        min={0}
        max={100}
      />
    </div>
  );
}

type SliderProps = {
  label: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & ComponentProps<"input">;

function HSLSlider({ id, label, value, ...delegated }: SliderProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input {...delegated} id={id} type="range" value={value} step={0.1} />
      <span>{value.toFixed(1)}</span>
    </div>
  );
}
