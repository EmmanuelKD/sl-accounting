// material-ui
import { ButtonBase, SxProps } from "@mui/material";

// project import
import { Theme } from "@mui/material";
import Logo from "./Logo";
import Link from "next/link";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx, to }: LogoSectionPropTypes) => (
  <ButtonBase disableRipple component={Link} href={to ?? "/"} sx={sx}>
    <Logo />
  </ButtonBase>
);

type LogoSectionPropTypes = {
  sx?: SxProps<Theme>;
  to?: string;
};

export default LogoSection;
