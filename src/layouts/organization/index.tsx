import { usePathname, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Container, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import { paths } from '../../paths';
import { ReactNode } from 'react';

const tabOptions = [
  {
    label: 'General',
    path: paths.dashboard.organization.index
  },
  {
    label: 'Application',
    path: paths.dashboard.organization.application.index
  },
  {
    label: 'Team',
    path: paths.dashboard.organization.team
  },
  {
    label: 'Billing',
    path: paths.dashboard.organization.billing
  }
];

type LayoutPropTypes = {
  children: ReactNode
};

export const Layout = (props:LayoutPropTypes) => {
  const { children } = props;
  const router = useRouter();
  const pathname = usePathname();

  const handleTabsChange = (event:any, value:any) => {
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
                Organization Settings
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

