import { formatHex, okhsl } from "./culori";
import type { ColorSearchParams, SystemParams, ChangedParams } from "@/constants";

export function generateKeyColorClient(changedParams: ChangedParams, nextData: SystemParams) {
  const [updatedParam] = changedParams;

  if (updatedParam.param === "hex") {
    const hsl = okhsl(`#${updatedParam.value}`);

    if (!hsl)
      throw new Error(
        `Invalid hex value provided: ${updatedParam.value} (generateColorValuesClient)`
      );

    const { h, s, l } = hsl;
    return {
      ...nextData,
      hex: updatedParam.value,
      hue: h?.toFixed(2) ?? "0",
      saturation: (s * 100).toFixed(2),
      lightness: (l * 100).toFixed(2),
    };
  } else if (
    updatedParam.param === "hue" ||
    updatedParam.param === "saturation" ||
    updatedParam.param === "lightness"
  ) {
    const hue = updatedParam.param === "hue" ? updatedParam.value : nextData.hue;
    const saturation =
      updatedParam.param === "saturation" ? updatedParam.value : nextData.saturation;
    const lightness = updatedParam.param === "lightness" ? updatedParam.value : nextData.lightness;
    const mode = "okhsl";
    const hex = formatHex({
      h: Number(hue),
      s: Number(saturation) / 100,
      l: Number(lightness) / 100,
      mode,
    });
    return {
      ...nextData,
      hex: hex.replace("#", ""),
      hue: hue,
      saturation: saturation,
      lightness: lightness,
    };
  } else {
    return {
      ...nextData,
      hex: nextData.hex,
      hue: nextData.hue,
      saturation: nextData.saturation,
      lightness: nextData.lightness,
    };
  }
}

export function generateKeyColorServer(searchParams: ColorSearchParams) {
  if (searchParams.hue && searchParams.saturation && searchParams.lightness) {
    const hue = searchParams.hue;
    const saturation = searchParams.saturation;
    const lightness = searchParams.lightness;
    const mode = "okhsl";
    const hex = formatHex({
      h: Number(hue),
      s: Number(saturation) / 100,
      l: Number(lightness) / 100,
      mode,
    });
    return {
      hex: hex,
      hue: hue,
      saturation: saturation,
      lightness: lightness,
    };
  } else if (searchParams.hex) {
    const { hex } = searchParams;
    const hsl = okhsl(hex);

    if (!hsl) throw new Error(`Invalid hex value provided: ${hex} (generateColorValuesServer)`);

    const { h, s, l } = hsl;
    return {
      hex: hex,
      hue: h ? h.toFixed(2) : "0",
      saturation: (s * 100).toFixed(2),
      lightness: (l * 100).toFixed(2),
    };
  } else {
    throw new Error(`Invalid search params provided: ${searchParams} (generateColorValuesServer)`);
  }
}
