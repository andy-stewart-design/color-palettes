export function generateSVG(hexColors: string[]) {
  const chipWidth = 112;
  const chipHeight = 136;
  const chipPadding = 8;
  const swatchSize = 96;
  const textSize = 10;
  const borderRadius = 8;

  const numCards = hexColors.length;
  const columns = numCards < 4 ? numCards : Math.floor(numCards / 10) + 4;
  const rows = Math.ceil(numCards / columns);

  const svgPadding = 8;
  const svgWidth = columns * chipWidth + (columns + 1) * svgPadding;
  const svgHeight = rows * chipHeight + (rows + 1) * svgPadding;

  let svg = `<svg width="${svgWidth}px" height="${svgHeight}px" xmlns="http://www.w3.org/2000/svg">`;

  for (let indexY = 0; indexY < rows; indexY++) {
    for (let indexX = 0; indexX < columns; indexX++) {
      const index = indexY * columns + indexX;
      if (index >= numCards) break;

      const color = hexColors[index];

      const chipOffsetX = indexX * (chipWidth + svgPadding) + svgPadding;
      const chipOffsetY = indexY * (chipHeight + svgPadding) + svgPadding;

      svg += `<g>`;
      svg += `<rect x="${chipOffsetX}" y="${chipOffsetY}" width="${chipWidth}" height="${chipHeight}" fill="white" rx="${borderRadius}" ry="${borderRadius}"/>`;

      const rectOffsetX = indexX * chipWidth + indexX * svgPadding + (svgPadding + chipPadding);
      const rectOffsetY = indexY * chipHeight + indexY * svgPadding + (svgPadding + chipPadding);

      svg += `<rect x="${rectOffsetX}" y="${rectOffsetY}" width="${swatchSize}" height="${swatchSize}" fill="${color}"/>`;

      const textOffsetY = rectOffsetY + textSize + swatchSize + chipPadding;
      svg += `<text x="${rectOffsetX}" y="${textOffsetY}" fill="#000" font-size="${textSize}" font-weight="600">${color}</text>`;

      svg += `</g>`;
    }
  }

  svg += `</svg>`;

  return svg;
}

export function generateSVGRaw(hexColors: string[]) {
  const chipWidth = 112;
  const chipHeight = 136;
  const chipPadding = 8;
  const swatchSize = 96;
  const textSize = 10;
  const borderRadius = 8;

  const numCards = hexColors.length;
  const columns = numCards < 4 ? numCards : Math.floor(numCards / 10) + 4;
  const rows = Math.ceil(numCards / columns);

  const svgPadding = 8;
  const svgWidth = columns * chipWidth + (columns + 1) * svgPadding;
  const svgHeight = rows * chipHeight + (rows + 1) * svgPadding;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", `${svgWidth}px`);
  svg.setAttribute("height", `${svgHeight}px`);
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

  for (let indexY = 0; indexY < rows; indexY++) {
    for (let indexX = 0; indexX < columns; indexX++) {
      const index = indexY * columns + indexX;
      if (index >= numCards) break;

      const color = hexColors[index];

      const group: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "g");

      const chipOffsetX = indexX * (chipWidth + svgPadding) + svgPadding;
      const chipOffsetY = indexY * (chipHeight + svgPadding) + svgPadding;
      const chip: SVGRectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      chip.setAttribute("x", chipOffsetX.toString());
      chip.setAttribute("y", chipOffsetY.toString());
      chip.setAttribute("width", chipWidth.toString());
      chip.setAttribute("height", chipHeight.toString());
      chip.setAttribute("fill", "white");
      chip.setAttribute("rx", borderRadius.toString());
      chip.setAttribute("ry", borderRadius.toString());

      const rectOffsetX = indexX * chipWidth + indexX * svgPadding + (svgPadding + chipPadding);
      const rectOffsetY = indexY * chipHeight + indexY * svgPadding + (svgPadding + chipPadding);
      const rect: SVGRectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", rectOffsetX.toString());
      rect.setAttribute("y", rectOffsetY.toString());
      rect.setAttribute("width", swatchSize.toString());
      rect.setAttribute("height", swatchSize.toString());
      rect.setAttribute("fill", color);

      const textOffsetY = rectOffsetY + textSize + swatchSize + chipPadding;
      const text: SVGTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", rectOffsetX.toString()); // this will change
      text.setAttribute("y", textOffsetY.toString()); // this will change
      text.setAttribute("fill", "#000");
      text.setAttribute("font-size", textSize.toString());
      text.setAttribute("font-weight", "600");
      text.textContent = color;

      group.appendChild(chip);
      group.appendChild(rect);
      group.appendChild(text);

      svg.appendChild(group);
    }
  }

  return svgToString(svg);
}

export function svgToString(svg: SVGSVGElement) {
  return new XMLSerializer().serializeToString(svg);
}
