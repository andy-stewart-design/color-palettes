"use client";

import { useRef, useEffect, type KeyboardEvent, MouseEvent } from "react";
import { useFormState } from "react-dom";
import classes from "./component.module.css";
import BaseNumberInput from "./BaseNumberInput";

type PropTypes = {
  name: string;
  label?: string;
  value: string;
  min: string;
  max: string;
  onChange: (name: string, value: string) => void;
};

export default function NumberInput({
  name,
  label,
  value: systemValue,
  onChange,
  min,
  max,
}: PropTypes) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formValue, formAction] = useFormState(handleSubmit, systemValue.toString());

  useEffect(() => {
    const input = inputRef.current;
    if (input && input.value !== systemValue) {
      input.value = systemValue;
    }
  }, [systemValue]);

  function handleSubmit(prevState: string, formData: FormData) {
    const input = inputRef.current;
    const formValue = formData.get(name);
    if (formValue === null || !input) return prevState;

    const nextValueString = formValue.toString();
    const nextValueNumber = parseInt(nextValueString);

    if (nextValueString !== "") {
      const clampedValue = clamp(nextValueNumber, parseFloat(min), parseFloat(max));
      onChange(name, clampedValue.toString());
      input.value = clampedValue.toString();
      return clampedValue.toString();
    } else {
      return nextValueString;
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const currentValue = e.currentTarget.valueAsNumber;
    const previousValue = parseFloat(formValue);
    const maxAsNumber = parseFloat(max);
    const minAsNumber = parseFloat(min);

    if (e.key === "ArrowUp") {
      if (currentValue >= maxAsNumber) e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (currentValue <= minAsNumber) e.preventDefault();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentValue !== previousValue) {
        formRef.current?.requestSubmit();
      }
    } else if (e.key === ".") {
      e.preventDefault();
    }
  }

  function handleKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      formRef.current?.requestSubmit();
    }
  }

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const input = inputRef.current;
    if (!input) return;

    const currentValue = input.valueAsNumber;
    const { type } = e.currentTarget.dataset;

    if (type === "decrement" && currentValue > parseFloat(min)) {
      input.value = (currentValue - 1).toString();
      formRef.current?.requestSubmit();
    } else if (type === "increment" && currentValue < parseFloat(max)) {
      input.value = (currentValue + 1).toString();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form ref={formRef} action={formAction} className={classes.form}>
      <label htmlFor={name} className={classes.label}>
        {label ?? name}
      </label>
      <BaseNumberInput
        ref={inputRef}
        id={name}
        name={name}
        defaultValue={formValue}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={handleClick}
      />
    </form>
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
