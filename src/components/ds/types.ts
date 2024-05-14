import { RefObject } from "react";

export interface InputProps {
  name: string;
  label?: string;
  value: string;
  form: RefObject<HTMLFormElement>;
}

export interface NumberInputProps extends InputProps {
  min: number | string;
  max: number | string;
  className?: string;
}
