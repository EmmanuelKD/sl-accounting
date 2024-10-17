import {
  blue,
  dtiTheme,
  dtiThemeSecondary,
  green,
  indigo,
  purple,
} from "./colors";

export const getPrimary = (preset: unknown) => {
  switch (preset) {
    case "blue":
      return blue;
    case "green":
      return green;
    case "indigo":
      return indigo;
    case "purple":
      return purple;
    case "dti":
      return dtiTheme;
    default:
      console.error(
        'Invalid color preset, accepted values: "dti", "blue", "green", "indigo" or "purple"".'
      );
      return indigo;
  }
};

export const getSecondary = (preset: unknown) => {
  switch (preset) {
    case "blue":
      return blue;
    case "green":
      return green;
    case "indigo":
      return indigo;
    case "purple":
      return purple;
    case "dti-sec":
      return dtiThemeSecondary;
    default:
      console.error(
        'Invalid color preset, accepted values: "dti-sec", "blue", "green", "indigo" or "purple"".'
      );
      return indigo;
  }
};
