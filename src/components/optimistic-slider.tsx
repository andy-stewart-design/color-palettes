"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useFormState } from "react-dom";

type PropTypes = {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
};

export default function OptimisticSlider({ name, value, onChange }: PropTypes) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formValue, formAction] = useFormState(handleSubmit, value);
  const [isActive, setIsActive] = useState(false);
  const [activeValue, setActiveValue] = useState(value);

  function handleSubmit(prevState: string, formData: FormData) {
    const formValue = formData.get(name);
    if (formValue === null) return prevState;

    onChange(name, formValue.toString());
    return formValue.toString();
  }

  function handleMouseDown() {
    setIsActive(true);
  }

  function handleMouseUp() {
    formRef.current?.requestSubmit();
    setIsActive(false);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setActiveValue(e.target.value);
  }

  return (
    <div>
      <form ref={formRef} action={formAction}>
        <input
          name="foo"
          type="range"
          min="0"
          max="100"
          step="0.01"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onChange={handleChange}
        />
      </form>
      {isActive ? <p style={{ opacity: 0.35 }}>Value: {activeValue}</p> : <p>Value: {value}</p>}
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  else return value;
}
