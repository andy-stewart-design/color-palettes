import { forwardRef, ComponentProps } from "react";
import classes from "./component.module.css";

type PropTypes = {
  variant?: "primary" | "secondary";
  isActive?: boolean;
} & ComponentProps<"button">;

const Button = forwardRef<HTMLButtonElement, PropTypes>(
  ({ children, variant = "primary", isActive, ...delegated }, ref) => {
    return (
      <button
        ref={ref}
        {...delegated}
        className={`${classes.button} ${classes[variant]}`}
        data-active={isActive ? "" : undefined}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
