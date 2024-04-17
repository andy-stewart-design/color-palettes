import { forwardRef, type ComponentPropsWithRef, MouseEvent } from "react";
import classes from "./component.module.css";

type El = HTMLInputElement;
type BaseProps = Omit<ComponentPropsWithRef<"input">, "onClick">;
type PropTypes = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
} & BaseProps;

export const BaseNumberInput = forwardRef<El, PropTypes>((props, ref) => {
  const { onClick, ...delegated } = props;

  return (
    <div className={classes.container}>
      <button data-type="decrement" onClick={onClick}>
        –
      </button>
      <input
        ref={ref}
        {...delegated}
        className={classes.input}
        type="number"
        onInput={(e) => e.currentTarget.setCustomValidity("")}
      />
      <button data-type="increment" onClick={onClick}>
        +
      </button>
    </div>
  );
});

BaseNumberInput.displayName = "BaseNumberInput";
export default BaseNumberInput;
