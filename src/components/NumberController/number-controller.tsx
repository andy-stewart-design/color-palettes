"use client";

import { ComponentProps, startTransition, useId, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import NumberInput from "../ds/NumberInput";

type PropTypes = {
  label: string;
  value: number;
  min: number;
  max: number;
  params: (value: number) => URLSearchParams;
} & ComponentProps<"input">;

export default function KeyIndexController({
  label,
  value: systemValue,
  params: getParams,
  ...delegated
}: PropTypes) {
  const [value, setValue] = useOptimistic(systemValue);
  const id = useId();
  const router = useRouter();

  function handleChange(newValue: number) {
    const params = getParams(newValue);

    startTransition(() => {
      setValue(newValue);
      router.push(`/?${params.toString()}`);
    });
  }

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <NumberInput {...delegated} id={id} type="number" value={value} onChange={handleChange} />
      {/* <input {...delegated} id={id} type="number" value={value} onChange={handleChange} /> */}
    </div>
  );
}
