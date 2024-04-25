"use client";

import { AnimatePresence } from "framer-motion";
import classes from "./component.module.css";

type PropTypes = {
  colors: Array<string>;
  names: Array<number>;
};

export default function ColorGrid({ colors, names }: PropTypes) {
  //   console.log(colors);

  return (
    <section className={classes.grid}>
      <AnimatePresence mode={"popLayout"} initial={false}>
        {colors.map((color, index) => (
          <div key={names[index]} style={{ backgroundColor: color, flexGrow: 1 }}>
            <div>
              {names[index]}: {color}
            </div>
          </div>
        ))}
        <div></div>
      </AnimatePresence>
    </section>
  );
}
