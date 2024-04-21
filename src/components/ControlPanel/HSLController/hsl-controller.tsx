import { RangeSlider } from "@/components/ds/inputs";
import classes from "./component.module.css";

type PropTypes = {
  h: string;
  s: string;
  l: string;
  onChange: (name: string, value: string) => void;
};

export default function HSLController({ h, s, l, onChange }: PropTypes) {
  function handleChange(name: string, value: string) {
    const newH = name === "h" ? value : h;
    const newS = name === "s" ? value : s;
    const newL = name === "l" ? value : l;

    const hsl = `${newH}_${newS}_${newL}`;

    onChange("hsl", hsl);
  }

  // const hue = parseFloat(h).toFixed(getDecimalCount(h));
  // const sat = parseFloat(s).toFixed(getDecimalCount(s));
  // const lit = parseFloat(l).toFixed(getDecimalCount(l));

  return (
    <div className={classes.controller}>
      <RangeSlider
        name="h"
        value={h}
        onChange={handleChange}
        min="0"
        max="360"
        className={classes.hue}
      />
      <RangeSlider
        name="s"
        value={s}
        onChange={handleChange}
        min="0"
        max="100"
        className={classes.sat}
      />
      <RangeSlider
        name="l"
        value={l}
        onChange={handleChange}
        min="0"
        max="100"
        className={classes.lit}
      />
    </div>
  );
}
