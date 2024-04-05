"use client";

import { startTransition, type KeyboardEvent, ChangeEvent } from "react";
import { useFormState } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { HEX_DEFAULT } from "@/app/constants";

type PropTypes = {
  hex: string;
};

export default function HexForm({ hex }: PropTypes) {
  const [state, formAction] = useFormState(handleSubmit, hex.replace("#", ""));
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  function handleSubmit(__prevState: string, formData: FormData) {
    const hexData = formData.get("hex");
    if (hexData === null) return `${hexData}`;

    const hexValue = hexData.toString();
    if (hexValue.length === 2 || hexValue.length === 4 || hexValue.length === 5) {
      return hexValue;
    }

    if (hexValue !== "") {
      const formattedValue = formatHexValue(hexValue);

      const params = generateSearchParams(formattedValue, currentSearchParams);

      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });

      return formattedValue;
    } else {
      const formattedValue = HEX_DEFAULT.replace("#", "");
      const params = generateSearchParams(formattedValue, currentSearchParams);

      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });

      return formattedValue;
    }
  }

  return (
    <form action={formAction}>
      <input
        type="text"
        name="hex"
        defaultValue={state}
        placeholder={HEX_DEFAULT.replace("#", "")}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// -----------------------------------------------------
// Helper functions
// -----------------------------------------------------

function handleChange(e: ChangeEvent<HTMLInputElement>) {
  const newValue = e.target.value;
  const containsInvalidCharacters = newValue.match(/[^#0-9a-fA-F]/gm);
  if (containsInvalidCharacters) e.preventDefault();

  if (newValue.length > 6) {
    const trimmedValue = e.currentTarget.value.slice(0, 6);
    e.currentTarget.value = trimmedValue;
  }
}

function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
  const isValidKey = testKeyValidity(e);
  if (isValidKey) return;
  if (e.key === "#") e.preventDefault();

  const containsInvalidCharacters = e.key.match(/[^#0-9a-fA-F]/gm);
  if (containsInvalidCharacters) e.preventDefault();
}

function testKeyValidity(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Backspace" || e.key === "Delete") return true;
  else if (e.key === "Enter" || e.key === "Meta") return true;
  else if (e.key === "ArrowLeft" || e.key === "ArrowRight") return true;
  else if (e.key === "ArrowDown" || e.key === "ArrowUp") return true;
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

function generateSearchParams(value: string, currentParams: URLSearchParams) {
  const params = new URLSearchParams(currentParams);
  params.delete("h");
  params.delete("s");
  params.delete("l");
  params.set("hex", value);
  return params;
}
