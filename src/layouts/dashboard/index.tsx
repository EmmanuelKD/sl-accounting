"use client";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Theme, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Footer } from "./footer";
import { MobileNav } from "./mobile-nav";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { neutral } from "@/theme/colors";
import { useSettings } from "@/context/settings-context";

const SIDE_NAV_WIDTH = 270;
const SIDE_NAV_PINNED_WIDTH = 73;
const TOP_NAV_HEIGHT = 64;

const useMobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (open) {
      setOpen(false);
    }
  }, [open]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleClose,
    handleOpen,
    open,
  };
};

const LayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: TOP_NAV_HEIGHT,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
  backgroundColor: neutral[100],
  // bgcolor: "neutral.200",
  // color: "neutral.600",
});
type LayoutPropTypes = {
  children: ReactNode;
};
export const DashboardLayout = (props: LayoutPropTypes) => {
  const { children } = props;
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const settings = useSettings();
  const mobileNav = useMobileNav();

  const handleNavPin = useCallback(() => {
    settings.handleUpdate({ pinNav: !settings.pinNav });
  }, [settings]);

  const offset = settings.pinNav ? SIDE_NAV_WIDTH : SIDE_NAV_PINNED_WIDTH;

  return (
    <>
      <TopNav onNavOpen={mobileNav.handleOpen} openNav={mobileNav.open} />
      {mdDown && (
        <MobileNav onClose={mobileNav.handleClose} open={mobileNav.open} />
      )}
      {!mdDown && <SideNav onPin={handleNavPin} pinned={settings.pinNav} />}
      <LayoutRoot
        sx={{
          minHeight: "100vh",
          pl: {
            md: offset + "px",
          },
        }}
      >
        <LayoutContainer>
          {children}
          <Footer />
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};
