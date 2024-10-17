import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { createOptions as createBaseOptions } from "./base/create-options";
import { createOptions as createDarkOptions } from "./dark/create-options";
import { createOptions as createLightOptions } from "./light/create-options";
import Typography from "./typography";
import CustomShadows from "./shadows";
import componentsOverride from "./overrides";

type CreateThemePropsType = {
  colorPreset: string;
  direction: string;
  paletteMode: string;
  contrast: string;
  responsiveFontSizes?: unknown;
};
export const createTheme = (config: CreateThemePropsType) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeTypography = Typography(`'Public Sans', sans-serif`);
  const themeCustomShadows = CustomShadows();

  let theme = createMuiTheme(
    // Base options available for both dark and light palette modes
    // @ts-expect-error unk
    createBaseOptions({
      direction: config.direction,
    }),
    // Options based on selected palette mode, color preset and contrast
    config.paletteMode === "dark"
      ? createDarkOptions({
          colorPreset: config.colorPreset,
          contrast: config.contrast,
          customShadows: themeCustomShadows,
          typography: themeTypography,
        })
      : createLightOptions({
          colorPreset: config.colorPreset,
          contrast: config.contrast,
          customShadows: themeCustomShadows,
          typography: themeTypography,
        })
  );
  theme.components = componentsOverride(theme);
  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
