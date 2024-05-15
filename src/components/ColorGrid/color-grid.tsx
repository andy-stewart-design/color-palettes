"use client";

import { AnimatePresence } from "framer-motion";
import classes from "./component.module.css";
import ColorCard from "./ColorCard";

type PropTypes = {
  colors: Array<string>;
  names: Array<number>;
  keyIndex: {
    current: string;
    default: string;
  };
};

export default function ColorGrid({ colors, names, keyIndex }: PropTypes) {
  return (
    <section className={classes.grid}>
      <AnimatePresence mode={"popLayout"} initial={false}>
        {colors.map((color, index) => (
          <ColorCard
            key={index}
            color={color}
            index={index}
            numItems={colors.length}
            name={names[index]}
            keyIndex={keyIndex}
          />
        ))}
        <div></div>
      </AnimatePresence>
    </section>
  );
}
