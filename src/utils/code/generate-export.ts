import { generateSVG } from "./generate-svg";
import { generateCSS, generateTailwind, generateW3CTokens } from "./generate-snippets";
import { highlightCode } from "./highlight-code";
import type { TabValue } from "@/components/ExportDialog/ExportPanel";
import type { ExportFiletype } from "../download-file";

type CodeProps = {
  colors: string[];
  intergerName: number[];
};

export type ExportedColor = {
  language: ExportFiletype;
  format: TabValue;
  htmlString: string;
  copyString: string;
};

export type ExportedColors = Array<ExportedColor>;

export function generateExport({ colors, intergerName }: CodeProps): ExportedColors {
  const svg: ExportedColor = {
    language: "svg",
    format: "figma",
    htmlString: generateSVG(colors),
    copyString: generateSVG(colors),
  };

  const cssCopyString = generateCSS(colors, intergerName);
  const css: ExportedColor = {
    language: "css",
    format: "css-vars",
    htmlString: cssCopyString,
    copyString: cssCopyString,
  };

  const tailwindCopyString = generateTailwind(colors, intergerName);
  const tailwind: ExportedColor = {
    language: "js",
    format: "tw-classic",
    htmlString: tailwindCopyString,
    copyString: tailwindCopyString,
  };

  const w3cCopyString = generateW3CTokens(colors, intergerName);
  const w3c: ExportedColor = {
    language: "json",
    format: "w3c-tokens",
    htmlString: w3cCopyString,
    copyString: w3cCopyString,
  };

  return [svg, css, tailwind, w3c];
}
