"use client";

import { startTransition } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

type PropTypes = {
  hex: string;
};

export default function StatefulForm({ hex }: PropTypes) {
  const [state, formAction] = useFormState(handleSubmit, hex.replace("#", ""));
  const router = useRouter();

  function handleSubmit(__prevState: string, formData: FormData) {
    const newHex = formData.get("hex");

    if (!newHex || newHex === "") return `${newHex}`;

    const params = new URLSearchParams();
    params.set("hex", newHex.toString());

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });

    return `${newHex}`;
  }

  return (
    <form action={formAction}>
      <input
        type="text"
        name="hex"
        defaultValue={state}
        placeholder="#000000"
        onKeyDown={(e) => e.key === "#" && e.preventDefault()}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
