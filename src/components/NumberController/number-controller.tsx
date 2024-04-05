"use client";

import { ChangeEvent, ComponentProps, startTransition, useId, useOptimistic } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PropTypes = {
  label: string;
  value: number;
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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newValue = parseInt(e.target.value);
    const params = getParams(newValue);

    startTransition(() => {
      setValue(newValue);
      router.push(`/?${params.toString()}`);
    });
  }

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input {...delegated} id={id} type="number" value={value} onChange={handleChange} />
    </div>
  );
}
