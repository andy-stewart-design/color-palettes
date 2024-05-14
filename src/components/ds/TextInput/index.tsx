import { Label, Input, TextField } from "react-aria-components";
import { useSynchronizedState } from "@/hooks/use-synchronized-state";
import { DEV } from "@/constants";
import type { KeyboardEvent } from "react";
import type { InputProps } from "@/components/ds/types";
import shared from "../components.module.css";
import classes from "./component.module.css";

export default function TextInput({ name, label, value: systemValue, form }: InputProps) {
  const [key, setCurrentValue] = useSynchronizedState(systemValue);
  const displayLabel = label ?? name;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key.length > 1) return;

    const invalidCharacters = /[^0-9a-fA-F]/gm;
    if (event.key.match(invalidCharacters)) event.preventDefault();
  }

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      form.current?.requestSubmit();
    }
  }

  return (
    <TextField
      key={key}
      name={name}
      defaultValue={systemValue}
      onChange={setCurrentValue}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className={shared.formGroup}
    >
      <Label className={shared.label}>
        {displayLabel} {DEV && <span className={shared.resetCount}>Resets: {key}</span>}
      </Label>
      <div className={classes.inputWrap}>
        <Input className={classes.input} data-1p-ignore data-lpignore />
      </div>
    </TextField>
  );
}
