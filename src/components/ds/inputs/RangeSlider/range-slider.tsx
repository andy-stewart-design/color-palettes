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
  const normalizeValue =
    parseFloat(value) > parseFloat(max) - 0.1
      ? max
      : parseFloat(value).toFixed(getDecimalCount(value));

  const [formValue, formAction] = useFormState(handleSubmit, normalizeValue);
  const [sliderIsActive, setSliderIsActive] = useState(false);
  const [activeSliderValue, setActiveSliderValue] = useState(normalizeValue);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    if (slider.value !== value) {
      slider.value = value;
    }
  }, [value]);

  function handleSubmit(prevState: string, formData: FormData) {
    const formValue = formData.get(name);
    if (formValue === null) return prevState;

    onChange(name, formValue.toString());
    return formValue.toString();
  }

  // Range slider-specific functions

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

  // Number input-specific functions

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
    }
  }

  function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
    const slider = sliderRef.current;
    if (!slider) return;

    const sliderValue = e.target.value;
    sliderRef.current.value = sliderValue;
    formRef.current?.requestSubmit();
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
            type="number"
            value={normalizeValue}
            onKeyDown={handleNumberKeyDown}
            onChange={handleNumberChange}
            step={0.01}
            onInput={(e) => e.currentTarget.setCustomValidity("")}
          />
          {sliderIsActive && <div aria-hidden>{activeSliderValue}</div>}
        </div>
      </form>
    </div>
  );
}

function getDecimalCount(value: string) {
  if (value.includes(".")) {
    const decimals = value.split(".")[1].length;
    if (decimals > 2) return 2;
    else return decimals;
  } else return 0;
}
