"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import KeyIndexButton from "./KeyIndexButton";
import classes from "./component.module.css";
import HexColorButton from "./HexColorButton";

type PropTypes = {
  color: string;
  accentColor: string;
  name: number;
  index: number;
  numItems: number;
  keyIndex: {
    current: string;
    default: string;
  };
};

const ColorCard = forwardRef<HTMLDivElement, PropTypes>((props, ref) => {
  const { color, accentColor, index, numItems, name, keyIndex } = props;
  const isActive = index === Number(keyIndex.current);

  const boxShadow = `0 3px 8px -2px rgba(0 0 0 / ${(index + 1) * 0.025 + 0.15})`;

  return (
    <motion.div
      ref={ref}
      layout={true}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className={`${classes.card} color-card`}
      data-state={isActive ? "on" : "off"}
      data-color-card
      style={{
        "--background-color": color,
        "--box-shadow": boxShadow,
        "--text-color": accentColor,
        zIndex: isActive ? 100000 : 30 - index,
      }}
    >
      <HexColorButton color={color} name={name} />
      <KeyIndexButton index={index} keyIndex={keyIndex} isActive={isActive} />
    </motion.div>
  );
});

ColorCard.displayName = "ColorCard";
export default ColorCard;
