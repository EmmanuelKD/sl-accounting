import { useCallback, useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {ChevronLeft as ChevronLeftIcon,ChevronRight as ChevronRightIcon, ChevronLeftSharp as ChevronDownIcon} from '@mui/icons-material';
 import { Box, ButtonBase, Collapse, SvgIcon } from '@mui/material';


type SideNavItemPropTypes = {
  active:  boolean,
  children?:  any,
  external: boolean,
  openImmediately?: boolean,
  path:  string,
  title: string 
};

export const SideNavItem = (props:SideNavItemPropTypes) => {
  const {
    active = false,
    children,
    external = false,
    openImmediately = false,
    path,
    title
  } = props;
  const [open, setOpen] = useState(openImmediately);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  // Branch

  if (children) {
    return (
      <li>
        <ButtonBase
          onClick={handleToggle}
          sx={{
            alignItems: 'center',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            px: '12px',
            py: '6px',
            textAlign: 'left',
            width: '100%',
            ...(active && {
              backgroundColor: 'action.hover'
            }),
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Box
            component="span"
            sx={{
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '24px',
              whiteSpace: 'nowrap',
              ...(active && {
                color: 'primary.main'
              })
            }}
          >
            {title}
          </Box>
          <SvgIcon
            sx={{
              color: 'action.active',
              fontSize: 16,
              ml: 2
            }}
          >
            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </SvgIcon>
        </ButtonBase>
        <Collapse
          in={open}
          sx={{ mt: 0.5 }}
        >
          {children}
        </Collapse>
      </li>
    );
  }

  // Leaf

  const linkProps = path
    ? external
      ? {
        component: 'a',
        href: path,
        target: '_blank'
      }
      : {
        component: NextLink,
        href: path
      }
    : {};

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          px: '12px',
          py: '6px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            backgroundColor: 'action.hover'
          }),
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
        {...linkProps}>
        <Box
          component="span"
          sx={{
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            ...(active && {
              color: 'primary.main'
            })
          }}
        >
          {title}
        </Box>
      </ButtonBase>
    </li>
  );
};

