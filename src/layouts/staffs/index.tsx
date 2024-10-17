import {
  Box,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { paths } from "../../paths";

const tabOptions = [
  {
    label: "List",
    path: paths.dashboard.staffs.index,
  },
  {
    label: "Role and Salaries",
    path: paths.dashboard.staffs.role_and_salary,
  },
  {
    label: "Benefits and bonus",
    path: paths.dashboard.staffs.benefits_and_bonus,
  },
];

type LayoutPropTypes = {
  children: ReactNode;
};

export const Layout = (props: LayoutPropTypes) => {
  const { children } = props;
  const router = useRouter();
  const pathname = usePathname();

  const handleTabsChange = (event: any, value: any) => {
    router.push(value);
  };

  const currentTab = tabOptions.find((option) => option.path === pathname);

  return (
    <Box
      sx={{
        flexGrow: 1,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack spacing={2}>
            <div>
              <Typography variant="h4">Staffs</Typography>
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
