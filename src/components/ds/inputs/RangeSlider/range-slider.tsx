"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import classes from "./component.module.css";

type PropTypes = {
  name: string;
  value: string;
  min: string;
  max: string;
  onChange: (name: string, value: string) => void;
};

export default function RangeSlider({ name, value, min, max, onChange }: PropTypes) {
  const formRef = useRef<HTMLFormElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const normalizedValue = normalizeValue(value, min, max);

  const [formValue, formAction] = useFormState(handleSubmit, normalizedValue);
  const [sliderIsActive, setSliderIsActive] = useState(false);
  const [activeSliderValue, setActiveSliderValue] = useState(normalizedValue);

  useEffect(() => {
    const slider = sliderRef.current;
    const number = numberRef.current;
    if (!slider || !number) return;

    if (slider.value !== value) slider.value = value;
    if (number.value !== value) number.value = normalizedValue;
  }, [value]);

  function handleSubmit(prevState: string, formData: FormData) {
    const formValue = formData.get(name);
    if (formValue === null) return prevState;

    onChange(name, formValue.toString());
    return formValue.toString();
  }

  // RANGE SLIDER-SPECIFIC FUNCTIONS

  function handleSliderKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const slider = sliderRef.current;
    if (!slider) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const newValue = Math.floor(e.currentTarget.valueAsNumber) + 1;
      slider.value = newValue.toString();
      formRef.current?.requestSubmit();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const newValue = Math.ceil(e.currentTarget.valueAsNumber) - 1;
      slider.value = newValue.toString();
      formRef.current?.requestSubmit();
    }
  }

  function onInteractionStart() {
    setSliderIsActive(true);
  }

  function handleSliderChange(e: ChangeEvent<HTMLInputElement>) {
    setActiveSliderValue(e.target.value);
  }

  function onInteractionEnd() {
    formRef.current?.requestSubmit();
    setSliderIsActive(false);
  }

  // NUMBER INPUT-SPECIFIC FUNCTIONS

  function handleNumberKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const slider = sliderRef.current;
    if (!slider) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newValue = Math.floor(e.currentTarget.valueAsNumber) + 1;
      slider.value = newValue.toString();
      formRef.current?.requestSubmit();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newValue = Math.ceil(e.currentTarget.valueAsNumber) - 1;
      slider.value = newValue.toString();
      formRef.current?.requestSubmit();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const newValue = e.currentTarget.valueAsNumber;
      const previousValue = parseFloat(formValue);
      if (newValue !== previousValue) {
        slider.value = newValue.toString();
        formRef.current?.requestSubmit();
      }
    }
  }

  return (
    <div>
      <form ref={formRef} action={formAction} className={classes.form}>
        <label htmlFor={name} className={classes.label}>
          {name.charAt(0).toUpperCase()}
        </label>
        <input
          ref={sliderRef}
          id={name}
          name={name}
          type="range"
          min={min}
          max={max}
          step="0.01"
          defaultValue={formValue}
          onMouseDown={onInteractionStart}
          onTouchStart={onInteractionStart}
          onKeyDown={handleSliderKeyDown}
          onChange={handleSliderChange}
          onMouseUp={onInteractionEnd}
          onTouchEnd={onInteractionEnd}
        />
        <div className={classes.number}>
          <input
            ref={numberRef}
            type="number"
            defaultValue={formValue}
            onKeyDown={handleNumberKeyDown}
            step={0.01}
            onInput={(e) => e.currentTarget.setCustomValidity("")}
          />
          {sliderIsActive && <div aria-hidden>{activeSliderValue}</div>}
        </div>
      </form>
    </div>
  );
}

// -----------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------

function normalizeValue(value: string, min: string, max: string) {
  const valueAsNumber = parseFloat(value);
  if (valueAsNumber > parseFloat(max) - 0.1) {
    return max;
  } else if (valueAsNumber < parseFloat(min) + 0.1) {
    return min;
  }

  if (value.includes(".")) {
    const [_, float] = value.split(".");

    if (parseInt(float) < 5) {
      return Math.floor(valueAsNumber).toString();
    } else if (parseInt(float) > 95) {
      return Math.ceil(valueAsNumber).toString();
    } else {
      const decimalCount = float.length > 2 ? 2 : float.length;
      return valueAsNumber.toFixed(decimalCount);
    }
  } else {
    return value;
  }
}
