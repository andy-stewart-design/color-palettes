import { Label, Input, NumberField, Group, Button } from "react-aria-components";
import { useSynchronizedState } from "@/hooks/use-synchronized-state";
import { DEV } from "@/constants";
import cn from "clsx";
import { useRef, type KeyboardEvent } from "react";
import type { NumberInputProps } from "@/components/ds/types";
import shared from "../components.module.css";
import classes from "./component.module.css";

export default function NumberInput({
  name,
  label,
  value: systemValue,
  min,
  max,
  form,
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const systemValueAsNumber = Number.isNaN(parseFloat(systemValue)) ? -1 : parseFloat(systemValue);
  const [key, setCurrentValue] = useSynchronizedState(systemValueAsNumber);
  const displayLabel = label ?? name;

  function requestSubmit() {
    const value = inputRef.current?.value;
    if (!value) return;
    const valueAsNumber = Number(value);

    if (valueAsNumber >= Number(min) && valueAsNumber <= Number(max)) {
      form.current?.requestSubmit();
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      requestSubmit();
    }
  }

  return (
    <NumberField
      key={key}
      name={name}
      defaultValue={systemValueAsNumber}
      minValue={Number(min)}
      maxValue={Number(max)}
      onChange={setCurrentValue}
      onKeyUp={handleKeyUp}
      className={cn(shared.formGroup, classes.formGroup)}
    >
      <Label className={shared.label}>
        {displayLabel} {DEV && <span className={shared.resetCount}>Resets: {key}</span>}
      </Label>
      <Group className={classes.inputGroup}>
        <Button
          slot="decrement"
          className={classes.button}
          onPressUp={requestSubmit}
          isDisabled={false}
        >
          -
        </Button>
        <Input
          ref={inputRef}
          className={classes.input}
          inputMode="decimal"
          data-1p-ignore
          data-lpignore
        />
        <Button
          slot="increment"
          className={classes.button}
          onPressUp={requestSubmit}
          isDisabled={false}
        >
          +
        </Button>
      </Group>
    </NumberField>
  );
}
