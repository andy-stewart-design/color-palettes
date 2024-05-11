import { z } from "zod";

// ZOD SCHEMA

export const SearchParamEnum = z.enum([
  "hex",
  "hue",
  "saturation",
  "lightness",
  "steps",
  "index",
  "min",
  "max",
]);

export const SystemParamsSchema = z.object({
  hex: z.string(),
  hue: z.string(),
  saturation: z.string(),
  lightness: z.string(),
  steps: z.string(),
  index: z.string(),
});

export const ColorSearchParamsSchema = z.object({
  hex: z.string().optional(),
  hue: z.string().optional(),
  saturation: z.string().optional(),
  lightness: z.string().optional(),
});

export const SearchParamsSchema = ColorSearchParamsSchema.extend({
  steps: z.string().optional(),
  index: z.string().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
});

export const ChangedParamSchema = z.object({
  param: SearchParamEnum,
  value: z.string(),
});

export const ChangedParamsSchema = z.array(ChangedParamSchema);

// INFERRED TYPES

export type SearchParam = z.infer<typeof SearchParamEnum>;
export type SystemParams = z.infer<typeof SystemParamsSchema>;
export type ColorSearchParams = z.infer<typeof ColorSearchParamsSchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type ChangedParam = z.infer<typeof ChangedParamSchema>;
export type ChangedParams = z.infer<typeof ChangedParamsSchema>;

// CONSTANTS

export const DEFAULTS = {
  hex: "#4AA5B7",
  steps: "11",
  min: "12",
  max: "94",
};

export const PARAMS = SearchParamEnum.enum;

export const DEV = !!process && process.env.NODE_ENV === "development";
