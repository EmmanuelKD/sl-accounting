import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon';
import { Box, ButtonBase, Collapse, SvgIcon } from '@mui/material';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';


type SideNavItemPropTypes = {
  active: boolean,
  children?: any,
  collapse: boolean,
  depth: number,
  external: boolean,
  icon: any,
  openImmediately?: boolean,
  path:  string,
  title:  string 
};


export const SideNavItem = (props:SideNavItemPropTypes) => {
  const {
    active = false,
    children,
    collapse = false,
    depth = 0,
    external = false,
    icon,
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
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 500,
            justifyContent: 'flex-start',
            px: '6px',
            py: '12px',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            width: '100%'
          }}
        >
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'neutral.500',
              display: 'inline-flex',
              flexGrow: 0,
              flexShrink: 0,
              height: 24,
              justifyContent: 'center',
              width: 24
            }}
          >
            {icon}
          </Box>
          <Box
            component="span"
            sx={{
              color: depth === 0 ? 'text.primary' : 'text.secondary',
              flexGrow: 1,
              fontSize: 14,
              mx: '12px',
              transition: 'opacity 250ms ease-in-out',
              ...(active && {
                color: 'primary.main'
              }),
              ...(collapse && {
                opacity: 0
              })
            }}
          >
            {title}
          </Box>
          <SvgIcon
            sx={{
              color: 'neutral.500',
              fontSize: 16,
              transition: 'opacity 250ms ease-in-out',
              ...(collapse && {
                opacity: 0
              })
            }}
          >
            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </SvgIcon>
        </ButtonBase>
        <Collapse
          in={!collapse && open}
          unmountOnExit
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
          fontFamily: (theme) => theme.typography.fontFamily,
          fontSize: 14,
          fontWeight: 500,
          justifyContent: 'flex-start',
          px: '6px',
          py: '12px',
          textAlign: 'left',
          whiteSpace: 'nowrap',
          width: '100%'
        }}
        {...linkProps}>
        <Box
          component="span"
          sx={{
            alignItems: 'center',
            color: 'neutral.400',
            display: 'inline-flex',
            flexGrow: 0,
            flexShrink: 0,
            height: 24,
            justifyContent: 'center',
            width: 24
          }}
        >
          {icon}
        </Box>
        <Box
          component="span"
          sx={{
            color: depth === 0 ? 'text.primary' : 'text.secondary',
            flexGrow: 1,
            mx: '12px',
            transition: 'opacity 250ms ease-in-out',
            ...(active && {
              color: 'primary.main'
            }),
            ...(collapse && {
              opacity: 0
            })
          }}
        >
          {title}
        </Box>
        {external && (
          <SvgIcon
            sx={{
              color: 'neutral.500',
              fontSize: 18,
              transition: 'opacity 250ms ease-in-out',
              ...(collapse && {
                opacity: 0
              })
            }}
          >
            <ArrowTopRightOnSquareIcon />
          </SvgIcon>
        )}
      </ButtonBase>
    </li>
  );
};

