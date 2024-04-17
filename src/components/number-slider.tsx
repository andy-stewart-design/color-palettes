"use client";

import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { useFormState } from "react-dom";

type PropTypes = {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
};

export default function NumberSlider({ name, value, onChange }: PropTypes) {
  const formRef = useRef<HTMLFormElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [formValue, formAction] = useFormState(handleSubmit, value);
  const [sliderIsActive, setSliderIsActive] = useState(false);
  const [activeSliderValue, setActiveSliderValue] = useState(value);

  function handleSubmit(prevState: string, formData: FormData) {
    const formValue = formData.get(name);
    if (formValue === null) return prevState;

    onChange(name, formValue.toString());
    return formValue.toString();
  }

  function onInteractionStart() {
    setSliderIsActive(true);
  }

  function onInteractionEnd() {
    formRef.current?.requestSubmit();
    setSliderIsActive(false);
  }

  function handleSliderChange(e: ChangeEvent<HTMLInputElement>) {
    setActiveSliderValue(e.target.value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const slider = sliderRef.current;
    if (!slider) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newValue = Math.floor(e.currentTarget.valueAsNumber) + 1;
      sliderRef.current.value = newValue.toString();
      formRef.current?.requestSubmit();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newValue = Math.ceil(e.currentTarget.valueAsNumber) - 1;
      sliderRef.current.value = newValue.toString();
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
      <form ref={formRef} action={formAction}>
        <input
          ref={sliderRef}
          name="foo"
          type="range"
          min="0"
          max="100"
          step="0.01"
          defaultValue={formValue}
          onMouseDown={onInteractionStart}
          onTouchStart={onInteractionStart}
          onChange={handleSliderChange}
          onMouseUp={onInteractionEnd}
          onTouchEnd={onInteractionEnd}
        />
        <input
          type="number"
          value={value}
          onKeyDown={handleKeyDown}
          onChange={handleNumberChange}
          step={0.01}
          onInput={(e) => e.currentTarget.setCustomValidity("")}
        />
      </form>
      {sliderIsActive && <span style={{ opacity: 0.35 }}>{activeSliderValue}</span>}
    </div>
  );
}
