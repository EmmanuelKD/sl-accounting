import { usePathname, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Container, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import { paths } from '../../paths';
import { ReactNode, SyntheticEvent } from 'react';

const tabOptions = [
  {
    label: 'General',
    path: paths.dashboard.account.index
  },
  {
    label: 'Organization',
    path: paths.dashboard.account.organization
  },
  {
    label: 'Notifications',
    path: paths.dashboard.account.notifications
  }
];

type LayoutPropTypes = {
  children: ReactNode
};

export const Layout = (props:LayoutPropTypes) => {
  const { children } = props;
  const router = useRouter();
  const pathname = usePathname();

  const handleTabsChange = (event: SyntheticEvent<Element, Event>, value: any) => {
    router.push(value);
  };

  const currentTab = tabOptions.find((option) => option.path === pathname);

  return (
    <Box
      sx={{
        flexGrow: 1,
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack spacing={2}>
            <div>
              <Typography variant="h4">
                Account Settings
              </Typography>
            </div>
            <div>
              <Tabs
                onChange={handleTabsChange}
                value={currentTab?.path}
                variant="scrollable"
              >
                {tabOptions.map((option) => (
                  <Tab
                    key={option.path}
                    label={option.label}
                    value={option.path}
                  />
                ))}
              </Tabs>
              <Divider />
            </div>
          </Stack>
          {children}
        </Stack>
      </Container>
    </Box>
  );
};

