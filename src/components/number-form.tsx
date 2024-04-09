"use client";

import { startTransition, useRef, ComponentPropsWithoutRef, useOptimistic } from "react";
import { useFormState } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";

type PropTypes = {
  //   hex: string;
};

const TEST_PARAM = "test";
const DEFAULT_VALUE = 5;
const MIN_VALUE = 0;
const MAX_VALUE = 15;

export default function NumberForm({}: PropTypes) {
  const [value, formAction] = useFormState(handleSubmit, DEFAULT_VALUE.toString());
  const [optimistic, setOptimistic] = useOptimistic(value);

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  function pushRouter(value: string) {
    const params = new URLSearchParams(currentSearchParams);

    if (parseInt(value) === DEFAULT_VALUE) params.delete(TEST_PARAM);
    else params.set(TEST_PARAM, value);

    startTransition(() => {
      setOptimistic(value);
      router.push(`/?${params.toString()}`);
    });
  }

  function handleSubmit(prevState: string, formData: FormData) {
    const formValue = formData.get(TEST_PARAM);
    if (formValue === null) return prevState;

    const nextValueString = formValue.toString();
    const nextValueNumber = parseInt(nextValueString);

    console.log({ nextValueString });

    if (nextValueString !== "") {
      const clampedValue = clamp(nextValueNumber, MIN_VALUE, MAX_VALUE);
      pushRouter(clampedValue.toString());
      return clampedValue.toString();
    } else {
      return nextValueString;
    }
  }

  function handleChange() {
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={formAction}>
      <NumberInput name={TEST_PARAM} value={optimistic} onChange={handleChange} />
    </form>
  );
}

// -----------------------------------------------------
// NUMBER INPUT
// -----------------------------------------------------

type BaseNumberInputProps = Pick<
  ComponentPropsWithoutRef<"input">,
  Exclude<keyof ComponentPropsWithoutRef<"input">, "value">
>;

type NumberInputProps = {
  value: string;
} & BaseNumberInputProps;

export function NumberInput({ value, ...delegated }: NumberInputProps) {
  return (
    <input
      {...delegated}
      type="number"
      value={value}
      placeholder={value}
      min={MIN_VALUE}
      max={MAX_VALUE}
      onInput={(e) => e.currentTarget.setCustomValidity("")}
    />
  );
}

// -----------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------

function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  else return value;
}
