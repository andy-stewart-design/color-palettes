import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export function useSynchronizedState(
  systemValue: string | number
): [number, Dispatch<SetStateAction<string | number>>] {
  const [currentValue, setCurrentValue] = useState(systemValue);
  const [previousValue, setPreviousValue] = useState(systemValue);
  const [key, setKey] = useState(0);

  if (previousValue !== systemValue) {
    setPreviousValue(systemValue);
    if (currentValue !== systemValue) {
      console.log("resetting text input");
      setCurrentValue(systemValue);
      setKey(key + 1);
    }
  }

  return [key, setCurrentValue];
}
