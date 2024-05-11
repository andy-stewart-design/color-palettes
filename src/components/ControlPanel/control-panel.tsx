"use client";

import { startTransition, useOptimistic, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { TextInput, NumberInput, RangeInput } from "@/components/ds";
import { generateKeyColorClient } from "@/utils/generate-key-color";
import { PARAMS, SystemParamsSchema, ChangedParamsSchema } from "@/constants";
import type { SystemParams, ChangedParams } from "@/constants";
import classes from "./component.module.css";

interface PropTypes {
  hex: string;
  hue: string;
  saturation: string;
  lightness: string;
  steps: string;
  index: {
    current: string;
    default: string;
  };
}

export default function ControlPanel(props: PropTypes) {
  const systemValues = { ...props, hex: props.hex.replaceAll("#", ""), index: props.index.current };

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [_, formAction] = useFormState(handleSubmit, JSON.stringify(systemValues));
  const [optimisticValues, setOptimisticValues] = useOptimistic<SystemParams>(systemValues);
  const [currentSearchParams, setCurrentSearchParams] = useState(() => new URLSearchParams());

  function handleSubmit(_: string, nextFormData: FormData) {
    const formData = compare(optimisticValues, nextFormData);

    if (formData.diff.length === 0) {
      setOptimisticValues(formData.next);
      return JSON.stringify(formData.next);
    } else if (formData.diff[0].value === "") {
      setOptimisticValues(formData.next);
      return JSON.stringify(formData.previous);
    } else if (formData.diff.length > 1) {
      throw new Error("More than one param changed");
    }

    const colorValues = generateKeyColorClient(formData.diff, formData.next);
    const searchParams = setParams(formData.diff, colorValues, currentSearchParams, props);

    startTransition(() => {
      setCurrentSearchParams(searchParams);
      setOptimisticValues(colorValues);
      router.push(`/?${searchParams.toString()}`);
    });

    return JSON.stringify(formData.next);
  }

  return (
    <form ref={formRef} action={formAction}>
      <div className={classes.section}>
        <TextInput
          name={PARAMS.hex}
          label="Key Color"
          value={optimisticValues.hex}
          form={formRef}
        />
        <RangeInput
          name={PARAMS.hue}
          value={optimisticValues.hue}
          min="0"
          max="360"
          form={formRef}
        />
        <RangeInput
          name={PARAMS.saturation}
          value={optimisticValues.saturation}
          min="0"
          max="100"
          form={formRef}
        />
        <RangeInput
          name={PARAMS.lightness}
          value={optimisticValues.lightness}
          min="0"
          max="100"
          form={formRef}
        />
      </div>
      <div className={classes.section}>
        <NumberInput
          name={PARAMS.steps}
          value={optimisticValues.steps}
          min="3"
          max="19"
          form={formRef}
        />
      </div>
      <div className={classes.section}>
        <NumberInput
          name={PARAMS.index}
          value={optimisticValues.index}
          min="0"
          max={Number(optimisticValues.steps) - 1}
          form={formRef}
        />
      </div>
    </form>
  );
}

// ------------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------------

function compare(prevData: SystemParams, nextData: FormData) {
  const prevObject = SystemParamsSchema.parse(prevData);
  const nextObject = SystemParamsSchema.parse(Object.fromEntries(nextData));

  const prevArray = Object.entries(prevObject);
  const nextArray = Object.entries(nextObject);

  if (prevArray.length === 0) {
    return {
      previous: prevData,
      next: nextObject,
      diff: ChangedParamsSchema.parse({}),
    };
  }

  const diffArray = nextArray.filter(([_, value], index) => {
    const nextValueAsNumber = Number(value);
    if (isNaN(nextValueAsNumber)) {
      return value !== prevArray[index][1];
    } else {
      return nextValueAsNumber !== Number(prevArray[index][1]);
    }
  });

  const diffObjectArray = diffArray.map(([key, value]) => ({ param: key, value }));
  const validatedDiff = ChangedParamsSchema.parse(diffObjectArray);

  return {
    previous: prevData,
    next: nextObject,
    diff: validatedDiff,
  };
}

function setParams(
  changedParams: ChangedParams,
  nextParams: SystemParams,
  currentParams: URLSearchParams,
  props: PropTypes
) {
  let params: URLSearchParams;
  const [updatedParam] = changedParams;

  if (updatedParam.param === "hex") {
    params = new URLSearchParams();
    params.set(updatedParam.param, nextParams[updatedParam.param]);
    if (nextParams.steps !== "11") params.set(PARAMS.steps, nextParams.steps);
  } else if (
    updatedParam.param === "hue" ||
    updatedParam.param === "saturation" ||
    updatedParam.param === "lightness"
  ) {
    const { hue, saturation, lightness } = nextParams;
    params = new URLSearchParams({ hue, saturation, lightness });
    if (nextParams.steps !== "11") params.set(PARAMS.steps, nextParams.steps);
  } else if (updatedParam.param === "steps") {
    params = new URLSearchParams(currentParams);
    if (params.get("index")) {
      const index = Number(params.get("index"));
      const steps = Number(nextParams.steps);
      if (index >= steps) {
        params.set(PARAMS.index, (steps - 1).toString());
      }
    }
    if (nextParams.steps !== "11") params.set(PARAMS.steps, nextParams.steps);
    else params.delete(PARAMS.steps);
  } else if (updatedParam.param === "index") {
    params = new URLSearchParams(currentParams);
    if (nextParams.index !== props.index.default) params.set(PARAMS.index, nextParams.index);
    else params.delete(PARAMS.index);
  } else params = new URLSearchParams(currentParams);

  return params;
}
