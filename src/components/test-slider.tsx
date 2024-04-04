"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import debounce from "just-debounce-it";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function TestSlider({ dv }: { dv: number }) {
  const [value, setValue] = useState(dv);
  const router = useRouter();

  console.log("rendering", value);

  useEffect(() => {
    setValue((current) => {
      console.log(current === dv);
      return current === dv ? current : dv;
    });
  }, [dv]);

  return (
    <div>
      <input
        type="range"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value);
          setValue(newValue);
          debouncedPush(router, newValue);
        }}
        min={0}
        max={10}
      />
      <span>{value}</span>
    </div>
  );
}

const debouncedPush = debounce((router: AppRouterInstance, value: number) => {
  const params = new URLSearchParams();
  params.set("test", value.toString());

  router.push(`/?${params.toString()}`);
}, 200);
