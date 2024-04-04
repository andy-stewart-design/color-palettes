import type { ChangeEvent, ComponentProps } from "react";

type HSLSliderProps = {
  label: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & ComponentProps<"input">;

export default function HSLSlider({ label, value, onChange, ...delegated }: HSLSliderProps) {
  const shortname = label.charAt(0).toLocaleLowerCase();

  return (
    <div>
      <label htmlFor={label}>{shortname.toLocaleUpperCase()}</label>
      <input {...delegated} id={label} type="range" value={value} onChange={onChange} step={0.1} />
      <span>{value.toFixed(1)}</span>
    </div>
  );
}
