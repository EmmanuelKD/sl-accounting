// material-ui
import { alpha } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
// ==============================|| DEFAULT THEME - CUSTOM SHADOWS  ||============================== //

const CustomShadows = () => ({
  button: `0 2px #0000000b`,
  text: `0 -1px 0 rgb(0 0 0 / 12%)`,
  z1: `0px 2px 8px ${alpha(grey[900], 0.15)}`,
  // only available in paid version
});

export default CustomShadows;
