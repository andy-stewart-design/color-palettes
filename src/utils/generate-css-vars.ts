import { Okhsl, formatHex } from "culori";

type GeneratePrimitiveCSSVariablesProps = {
  type: "primitive";
  colors: {
    raw: Okhsl[];
    hex: string[];
    intergerName: number[];
  };
};

type GenerateSemanticCSSVariablesProps = {
  type: "semantic";
  color: {
    hex: string;
    raw: Okhsl;
    intergerName: number;
    name: string;
  };
};

type GenerateCSSVariablesProps =
  | GeneratePrimitiveCSSVariablesProps
  | GenerateSemanticCSSVariablesProps;

export function generateCSSVariables(props: GenerateCSSVariablesProps) {
  if (props.type === "semantic") {
    const { color } = props;

    const { s, l } = color.raw;
    const h = color.raw.h ?? 0;
    const mode = "okhsl";

    const primary = formatHex({ mode, h, s: 0.95, l: 0.475 });
    const primaryLighter = formatHex({ mode, h, s: 0.9, l: 0.95 });
    const primaryLighterDesaturated = formatHex({ mode, h, s: 0.1, l: 0.85 });
    const primaryLight = formatHex({ mode, h, s: 0.9, l: 0.85 });
    const primaryMedium = formatHex({ mode, h, s, l: 0.5 });
    const primaryDark = formatHex({ mode, h, s: 0.9, l: 0.2 });
    const primaryDarker = formatHex({ mode, h, s: 0.9, l: 0.12 });
    const primarySaturated = formatHex({ mode, h, s: 1, l });
    const primaryDesaturated = formatHex({ mode, h, s: 0, l });
    const codeHighlight2 = formatHex({ mode, h: h + 45, s: 0.95, l: 0.5 });
    const codeHighlight3 = formatHex({ mode, h: h - 45, s: 0.95, l: 0.5 });

    return {
      "--color-primary": primary,
      "--color-primary-light": primaryLight,
      "--color-primary-lighter": primaryLighter,
      "--color-primary-lighter-desaturated": primaryLighterDesaturated,
      "--color-primary-dark": primaryDark,
      "--color-primary-darker": primaryDarker,
      "--color-primary-saturated": primarySaturated,
      "--color-primary-desaturated": primaryDesaturated,
      "--color-primary-medium": primaryMedium,
      "--code-highlight-1": primary,
      "--code-highlight-2": codeHighlight2,
      "--code-highlight-3": codeHighlight3,
    };
  } else {
    const { colors } = props;

    const variables = colors.hex.reduce((acc, color, index) => {
      const key = `--color-primary-${colors.intergerName[index]}`;
      const style = { [key]: color };
      return { ...acc, ...style };
    }, {});

    return variables as Record<string, string>;
  }
}
