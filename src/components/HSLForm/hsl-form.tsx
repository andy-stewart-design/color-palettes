"use client";

import { useState, useEffect, type ChangeEvent, type ComponentProps } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "just-debounce-it";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type PropTypes = {
  h: number;
  s: number;
  l: number;
};

export default function HSLForm({ h: defaultH, s: defaultS, l: defaultL }: PropTypes) {
  const [hue, setHue] = useState(defaultH);
  const [saturation, setSaturation] = useState(defaultS);
  const [lightness, setLightness] = useState(defaultL);
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  useEffect(() => {
    console.log("effect is running");

    setHue((currentH) => (currentH === defaultH ? currentH : defaultH));
    setSaturation((currentS) => (currentS === defaultS ? currentS : defaultS));
    setLightness((currentL) => (currentL === defaultL ? currentL : defaultL));
  }, [defaultH, defaultS, defaultL]);

  function handleChange(type: "h" | "s" | "l", value: string, onChange: (value: number) => void) {
    const nextValue = parseInt(value);
    const nextHue = type === "h" ? nextValue : hue;
    const nextSat = type === "s" ? nextValue : saturation;
    const nextLit = type === "l" ? nextValue : lightness;

    const params = new URLSearchParams(currentSearchParams);
    params.delete("hex");
    params.set("h", nextHue.toString());
    params.set("s", nextSat.toString());
    params.set("l", nextLit.toString());

    onChange(nextValue);
    debouncedPush(router, params);
  }

  return (
    <div>
      <HSLSlider
        label="hue"
        value={hue}
        onChange={(e) => handleChange("h", e.target.value, setHue)}
        min={0}
        max={360}
      />
      <HSLSlider
        label="saturation"
        value={saturation}
        onChange={(e) => handleChange("s", e.target.value, setSaturation)}
        min={0}
        max={100}
      />
      <HSLSlider
        label="lightness"
        value={lightness}
        onChange={(e) => handleChange("l", e.target.value, setLightness)}
        min={0}
        max={100}
      />
    </div>
  );
}

type HSLSliderProps = {
  label: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & ComponentProps<"input">;

function HSLSlider({ label, value, onChange, ...delegated }: HSLSliderProps) {
  const shortname = label.charAt(0).toLocaleLowerCase();

  return (
    <div>
      <label htmlFor={label}>{shortname.toLocaleUpperCase()}</label>
      <input {...delegated} id={label} type="range" value={value} onChange={onChange} step={0.1} />
      <span>{value.toFixed(1)}</span>
    </div>
  );
}

const debouncedPush = debounce((router: AppRouterInstance, params: URLSearchParams) => {
  router.push(`/?${params.toString()}`);
}, 200);
