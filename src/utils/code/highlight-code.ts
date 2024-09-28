import { createCssVariablesTheme, getHighlighter } from "shiki";

const theme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--code-",
  variableDefaults: {},
  fontStyle: true,
});

const highlighter = await getHighlighter({
  themes: [theme],
  langs: ["javascript", "css", "json"],
});

export function highlightCode(code: string, lang = "javascript") {
  const highlightedCode = highlighter.codeToHtml(code, {
    lang: lang,
    theme: "css-variables",
  });

  return highlightedCode;
}
