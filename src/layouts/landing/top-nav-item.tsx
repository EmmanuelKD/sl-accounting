import NextLink from "next/link";
import PropTypes from "prop-types";
import { Box, ButtonBase } from "@mui/material";
import { ReactNode } from "react";

type TopNavItemPropTypes = {
  external?: boolean;
  path?: string;
  popover?: ReactNode;
  title: string;
};
export const TopNavItem = (props: TopNavItemPropTypes) => {
  const { external, path, popover, title } = props;

  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  // NOTE: Dropdown is a div element, we display it on list item hover

  return (
    <Box
      component="li"
      sx={{
        "&:hover > div": {
          display: "block",
        },
      }}
    >
      <ButtonBase
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          fontFamily: (theme) => theme.typography.fontFamily,
          fontSize: 14,
          fontWeight: 500,
          justifyContent: "flex-start",
          lineHeight: "24px",
          px: "12px",
          py: "6px",
          textAlign: "left",
          whiteSpace: "nowrap",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
        {...linkProps}
      >
        {title}
      </ButtonBase>
      {popover}
    </Box>
  );
};
