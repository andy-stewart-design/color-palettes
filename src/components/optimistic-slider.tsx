"use client";

import { startTransition, useOptimistic, useRef } from "react";
import { useFormState } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";

export default function OptimisticSlider() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(handleSubmit, "50");
  const [optimistic, setOptimistic] = useOptimistic(state);
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  function handleSubmit(prevState: string, formData: FormData) {
    const formValue = formData.get("foo");
    if (formValue === null) return prevState;

    const pushRouter = formData.get("pushRouter");
    if (pushRouter !== null) {
      const params = new URLSearchParams(currentSearchParams);
      params.set("slider", formValue.toString());
      startTransition(() => {
        setOptimistic(formValue.toString());
        router.push(`/?${params.toString()}`);
      });
      return formValue.toString();
    } else {
      startTransition(() => {
        setOptimistic(formValue.toString());
      });

      return formValue.toString();
    }
  }

  function handleChange() {
    formRef.current?.requestSubmit();
  }

  function handleMouseUp() {
    const form = formRef.current;
    if (form === null) return;

    const formData = new FormData(form);
    formData.append("pushRouter", "true");

    handleSubmit(state, formData);
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
          value={optimistic}
          onChange={handleChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
        />
      </form>
      <p>{optimistic}</p>
    </div>
  );
}
