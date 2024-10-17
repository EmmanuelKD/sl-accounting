import { ReactNode, useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Footer } from './footer';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';

const useMobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (open) {
      setOpen(false);
    }
  }, [open]);

  useEffect(() => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleClose,
    handleOpen,
    open
  };
};

const LayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100%'
}));

type LayoutPropTypes = {
  children: ReactNode
};
export const Layout = (props:LayoutPropTypes) => {
  const { children } = props;
  // @ts-ignore
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const mobileNav = useMobileNav();

  return (
    <LayoutRoot>
      <TopNav onNavOpen={mobileNav.handleOpen} />
      {mdDown && (
        <SideNav
          onClose={mobileNav.handleClose}
          open={mobileNav.open}
        />
      )}
      {children}
      <Footer />
    </LayoutRoot>
  );
};


