"use client";

import { ComponentProps } from "react";
import { useSearchParams } from "next/navigation";
import NumberController from "@/components/NumberController";
import { MAX_BRIGHTNESS_DEFAULT, MAX_BRIGHTNESS_PARAM } from "@/app/constants";

type PropTypes = {
  value: number;
} & ComponentProps<"input">;

export default function MaxBrightnessController({ value }: PropTypes) {
  const currentSearchParams = useSearchParams();

  function getParams(value: number) {
    const params = new URLSearchParams(currentSearchParams);

    if (value === MAX_BRIGHTNESS_DEFAULT) params.delete(MAX_BRIGHTNESS_PARAM);
    else params.set(MAX_BRIGHTNESS_PARAM, value.toString());
    return params;
  }

  return (
    <NumberController label="Max Brightness" value={value} params={getParams} min={85} max={99} />
  );
}

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------
