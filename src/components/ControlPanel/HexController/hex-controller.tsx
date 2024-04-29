"use client";

import { useEffect, useRef, type KeyboardEvent, type ChangeEvent } from "react";
import { useFormState } from "react-dom";
import { HEX_DEFAULT } from "@/app/constants";
import classes from "./component.module.css";

type PropTypes = {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
};

export default function HexController({ name, value, onChange }: PropTypes) {
  const systemValue = value.replace("#", ""); // Hex value without #
  const inputRef = useRef<HTMLInputElement>(null);
  const [formState, formAction] = useFormState(handleSubmit, systemValue);

  useEffect(() => {
    const input = inputRef.current;
    const normalizedValue = systemValue;
    if (input && input.value !== normalizedValue) {
      input.value = normalizedValue;
    }
  }, [value]);

  function handleSubmit(__prevState: string, formData: FormData) {
    console.log({ prev: __prevState, next: Object.fromEntries(formData) });

    const hexData = formData.get(name);
    if (hexData === null) return `${hexData}`;

    const hexValue = hexData.toString();
    if (hexValue.length === 2 || hexValue.length === 4 || hexValue.length === 5) {
      return hexValue;
    }

    if (hexValue !== "" && hexValue !== systemValue) {
      const formattedValue = formatHexValue(hexValue);
      onChange(name, formattedValue);
      return formattedValue;
    } else {
      const formattedValue = HEX_DEFAULT.replace("#", "");
      return formattedValue;
    }
  }

  return (
    <form action={formAction} className={classes.form}>
      <input
        ref={inputRef}
        type="text"
        name={name}
        defaultValue={formState}
        placeholder={HEX_DEFAULT.replace("#", "")}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
    </form>
  );
}

// -----------------------------------------------------
// Helper functions
// -----------------------------------------------------

function handleChange(e: ChangeEvent<HTMLInputElement>) {
  const newValue = e.target.value;

  // console.log(newValue.charAt(0) === "#");

  if (newValue.charAt(0) === "#") {
    const trimmedValue = newValue.replace("#", "");
    e.currentTarget.value = trimmedValue;
  } else if (newValue.length > 6) {
    const trimmedValue = newValue.slice(0, 6);
    e.currentTarget.value = trimmedValue;
  }
}

function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
  const keyIsWhiteListed = testKeyValidity(e);
  if (keyIsWhiteListed) return;

  const keyIsInvalidCharacter = e.key.match(/[^0-9a-fA-F]/gm);
  if (keyIsInvalidCharacter) e.preventDefault();
}

function testKeyValidity(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Backspace" || e.key === "Delete") return true;
  else if (e.key === "Enter" || e.key === "Meta") return true;
  else if (e.key === "ArrowLeft" || e.key === "ArrowRight") return true;
  else if (e.key === "ArrowDown" || e.key === "ArrowUp") return true;
  else if (e.metaKey && (e.key === "v" || e.key === "V")) return true;
  else return false;
}

function formatHexValue(value: string) {
  if (value.length === 1) {
    return `${value}${value}${value}${value}${value}${value}`;
  } else if (value.length === 3) {
    return `${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`;
  } else if (value.length > 6) {
    return value.slice(0, 6);
  } else return value;
}
