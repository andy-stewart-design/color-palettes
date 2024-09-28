export type TabValue = "figma" | "css-vars" | "tw-classic" | "w3c-tokens";

export type ExportTypeTab = {
  label: string;
  value: TabValue;
  disabled: boolean;
};

export const tabContent: Array<ExportTypeTab> = [
  {
    label: "Figma",
    value: "figma",
    disabled: false,
  },
  {
    label: "CSS Variables",
    value: "css-vars",
    disabled: false,
  },
  {
    label: "Tailwind (pre v.4)",
    value: "tw-classic",
    disabled: false,
  },
  {
    label: "Tokens (W3C)",
    value: "w3c-tokens",
    disabled: false,
  },
];
