import type { KeyboardEvent } from "react";
import { Label, Slider, SliderOutput, SliderTrack, SliderThumb } from "react-aria-components";
import { useSynchronizedState } from "@/hooks/use-synchronized-state";
import type { NumberInputProps } from "@/components/ds/types";
import cn from "clsx";
import { DEV } from "@/constants";
import shared from "../components.module.css";
import classes from "./component.module.css";

export default function RangeInput({
  name,
  label,
  value: systemValue,
  min,
  max,
  form,
}: NumberInputProps) {
  const systemValueAsNumber = parseFloat(systemValue);
  const [key, setCurrentValue] = useSynchronizedState(systemValueAsNumber);
  const displayLabel = label ?? name;

  function requestSubmit() {
    form.current?.requestSubmit();
  }

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      requestSubmit();
    }
  }

  return (
    <Slider
      key={key}
      className={cn(classes.slider, shared.formGroup)}
      defaultValue={systemValueAsNumber}
      minValue={Number(min)}
      maxValue={Number(max)}
      step={0.01}
      onChange={(v) => setCurrentValue(v)}
      onChangeEnd={requestSubmit}
    >
      <div className={classes.metadata}>
        <Label className={shared.label} style={{ textTransform: "capitalize" }}>
          {displayLabel} {DEV && <span className={shared.resetCount}>Resets: {key}</span>}
        </Label>
        <SliderOutput className={classes.output} />
      </div>
      <SliderTrack className={classes.track}>
        <SliderThumb name={name} className={classes.thumb} onKeyDown={handleKeyUp} />
      </SliderTrack>
    </Slider>
  );
}
