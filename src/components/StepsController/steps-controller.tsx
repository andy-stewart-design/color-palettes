"use client";

import { ComponentProps } from "react";
import { useSearchParams } from "next/navigation";
import NumberController from "@/components/NumberController";
import { INDEX_PARAM, STEPS_DEFAULT, STEPS_PARAM } from "@/app/constants";

type PropTypes = {
  value: number;
} & ComponentProps<"input">;

export default function StepsController({ value }: PropTypes) {
  const currentSearchParams = useSearchParams();

  function getParams(value: number) {
    const params = new URLSearchParams(currentSearchParams);
    const index = currentSearchParams.get(INDEX_PARAM);

    if (index) {
      const idx = parseInt(index);
      if (value < idx) {
        params.set(INDEX_PARAM, value.toString());
      }
    }

    if (value === STEPS_DEFAULT) params.delete(STEPS_PARAM);
    else params.set(STEPS_PARAM, value.toString());
    return params;
  }

  return <NumberController label="Steps" value={value} params={getParams} min={3} max={19} />;
}
