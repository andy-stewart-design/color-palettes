export const HEX_DEFAULT = "#4AA5B7";

export const INDEX_PARAM = "idx";
export const INDEX_DEFAULT = "4";

export const STEPS_PARAM = "steps";
export const STEPS_DEFAULT = "11";

export const MAX_BRIGHTNESS_PARAM = "max";
export const MAX_BRIGHTNESS_DEFAULT = "95";

export const MIN_BRIGHTNESS_PARAM = "min";
export const MIN_BRIGHTNESS_DEFAULT = "12";

export const DEFAULTS = {
  params: {
    hex: "hex",
    hsl: "hsl",
    idx: "idx",
    steps: "steps",
    max: "max",
    min: "min",
  },
  values: {
    hex: "#4AA5B7",
    hsl: "50_50_50",
    idx: undefined,
    steps: "11",
    min: "12",
    max: "94",
  },
};

export type SEARCH_PARAMS = "hex" | "hsl" | "idx" | "steps" | "min" | "max";
