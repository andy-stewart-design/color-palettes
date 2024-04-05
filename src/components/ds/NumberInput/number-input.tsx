"use client";

import type { ChangeEvent, KeyboardEvent, ComponentPropsWithoutRef } from "react";

type BaseInputProps = Pick<
  ComponentPropsWithoutRef<"input">,
  Exclude<keyof ComponentPropsWithoutRef<"input">, "onChange">
>;
type PropTypes = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
} & BaseInputProps;

export default function NumberInput({
  value,
  onChange,
  disabled,
  min,
  max,
  ...delegated
}: PropTypes) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") return;

    if (disabled) return;

    const maxCharLength = max.toString().length;
    if (e.target.value.length > maxCharLength) return;

    onChange(parseInt(e.target.value));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      increment();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      decrement();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const newValue = value >= max ? max : value <= min ? min : value;
      onChange(newValue);
    }
  }

  function decrement() {
    if (disabled) return;

    const newValue = value - 1 <= min ? min : value - 1;
    onChange(newValue);
  }

  function increment() {
    if (disabled) return;

    const newValue = value + 1 >= max ? max : value + 1;
    onChange(newValue);
  }

  return (
    <input
      {...delegated}
      type="number"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
}
