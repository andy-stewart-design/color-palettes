"use client";

import { ComponentProps } from "react";
import { useSearchParams } from "next/navigation";
import NumberController from "@/components/NumberController";
import { INDEX_DEFAULT, INDEX_PARAM, STEPS_DEFAULT, STEPS_PARAM } from "@/app/constants";

type PropTypes = {
  value: number;
} & ComponentProps<"input">;

export default function KeyIndexController({ value }: PropTypes) {
  const currentSearchParams = useSearchParams();
  const max = getMax(currentSearchParams);

  function getParams(value: number) {
    const params = new URLSearchParams(currentSearchParams);

    if (value === INDEX_DEFAULT) params.delete(INDEX_PARAM);
    else params.set(INDEX_PARAM, value.toString());
    return params;
  }

  return <NumberController label="Key Index" value={value} params={getParams} min={0} max={max} />;
}

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

function getMax(searchParams: URLSearchParams) {
  const maxParam = searchParams.get(STEPS_PARAM);
  if (maxParam) return parseInt(maxParam);
  return STEPS_DEFAULT;
}
