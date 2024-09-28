// ---------------------------------------------------------------
// GENERATE RAW CSS
// ---------------------------------------------------------------
export function generateCSS(colors: string[], intergerName: number[]): string {
  const openingTag = ":where(html) {";
  const closingTag = "}";
  const variables = colors.map(
    (color, index) => `${space(3)}--color-primary-${intergerName[index]}: ${color};`
  );

  return [openingTag, ...variables, closingTag].join("\n").trim();
}

// ---------------------------------------------------------------
// GENERATE RAW TAILWIND (JS)
// ---------------------------------------------------------------
export function generateTailwind(colors: string[], intergerName: number[]): string {
  const openingTags = [
    `${space(0)}/** @type {import('tailwindcss').Config} */`,
    `${space(0)}module.exports = {`,
    `${space(2)}theme: {`,
    `${space(4)}extend: {`,
    `${space(6)}colors: {`,
    `${space(8)}primary: {`,
  ];

  const closingTags = new Array(openingTags.length - 1).fill(0).map((_, index) => {
    const numSpaces = openingTags.length - index - 2;

    return `${space(2 * numSpaces)}}`;
  });

  const variables = colors.map((color, index) => `${space(10)}${intergerName[index]}: '${color}',`);

  return [...openingTags, ...variables, ...closingTags].join("\n").trim();
}

// ---------------------------------------------------------------
// GENERATE RAW DESIGN TOKENS (JSON)
// ---------------------------------------------------------------
export function generateW3CTokens(colors: string[], intergerName: number[]): string {
  const openingTags = [
    `${space(0)}{`,
    `${space(2)}"tokens": {`,
    `${space(4)}"color": {`,
    `${space(6)}"primary": {`,
  ];

  const closingTags = openingTags.map((_, index) => {
    const numSpaces = openingTags.length - index - 1;
    return `${space(2 * numSpaces)}}`;
  });

  const tokens = colors
    .map((color, index) => {
      const isLast = index === colors.length - 1;
      const lines = [
        `${space(8)}"${intergerName[index]}": {`,
        `${space(10)}"$type": "color",`,
        `${space(10)}"$value": "${color}"`,
        `${space(8)}}${!isLast ? "," : ""}`,
      ];
      return lines;
    })
    .flat();

  return [...openingTags, ...tokens, ...closingTags].join("\n").trim();
}

// ---------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------
function space(amount: number) {
  return " ".repeat(amount);
}
