"use client";

import { useRef, ComponentPropsWithoutRef, ChangeEvent } from "react";
import { useFormState } from "react-dom";

type PropTypes = {
  name: string;
  value: string;
  min: string;
  max: string;
  onChange: (name: string, value: string) => void;
};

export default function NumberForm({ name, value, onChange, min, max }: PropTypes) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formValue, formAction] = useFormState(handleSubmit, value.toString());

  function handleSubmit(prevState: string, formData: FormData) {
    const formValue = formData.get(name);
    if (formValue === null) return prevState;

    const nextValueString = formValue.toString();
    const nextValueNumber = parseInt(nextValueString);

    if (nextValueString !== "") {
      const clampedValue = clamp(nextValueNumber, parseFloat(min), parseFloat(max));
      onChange(name, clampedValue.toString());
      return clampedValue.toString();
    } else {
      return nextValueString;
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={formAction}>
      <label htmlFor={name}>{name}</label>
      <NumberInput id={name} name={name} value={value.toString()} onChange={handleChange} />
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
