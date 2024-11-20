import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';
import { Box, Divider, IconButton, Stack, SvgIcon, useMediaQuery } from '@mui/material';
import NextLink from 'next/link';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
 import { paths } from '../../paths';
import { AccountPopover } from './account-popover';
import { TOP_NAV_HEIGHT } from '@/const';
import { useSettings } from '@/context/settings-context';
import Logo from '@/components/logo/Logo';

 
 
type TopNavPropTypes = {
  onNavOpen: ()=>void,
  openNav: boolean
};

export const TopNav = (props:TopNavPropTypes) => {
  const {  } = props;
  const { i18n, t } = useTranslation();
  const settings = useSettings();
  // @ts-expect-error unk
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
 
  const handleLanguageChange = useCallback((value:any) => {
    i18n.changeLanguage(value);
    toast.success(t('Language changed'));
  }, [i18n, t]);

  const handleThemeSwitch = useCallback(() => {
    settings.handleUpdate({
      paletteMode: settings.paletteMode === 'light' ? 'dark' : 'light'
    });
  }, [settings]);

  const handleDirectionSwitch = useCallback(() => {
    settings.handleUpdate({
      direction: settings.direction === 'ltr' ? 'rtl' : 'ltr'
    });
  }, [settings]);

 
  return (
    <Box
    id="topNavMain"
      component="header"
      sx={{

        backgroundColor: 'neutral.900',
        color: 'common.white',
        position: 'fixed',
        width: '100%',
        zIndex: (theme) => theme.zIndex.appBar
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 3
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={3}
          divider={(
            <Divider
              orientation="vertical"
              sx={{
                borderColor: 'neutral.500',
                // height: 36
                // marginTop:0
              }}
            />
          )}
        >
          <Box
            component={NextLink}
            href={paths.index}
            sx={{
              display: 'inline-flex',
              // height: 24,
              // width: 24
              //  marginTop:0
            }}
          >
            <Logo />
          </Box>
           
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
         
          {!mdDown && (
            <IconButton
              color="inherit"
              onClick={handleThemeSwitch}
            >
              <SvgIcon
                color="action"
                fontSize="small"
              >
                {settings.paletteMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              </SvgIcon>
            </IconButton>
          )}
           <AccountPopover
            direction={settings.direction as any}
            language={i18n.language as any}
            onDirectionSwitch={handleDirectionSwitch}
            onLanguageChange={handleLanguageChange}
             onThemeSwitch={handleThemeSwitch}
             paletteMode={settings.paletteMode as any}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

