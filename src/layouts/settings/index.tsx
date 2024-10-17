import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import {
  Box,
  Button,
  Container,
  Divider,
  Skeleton,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import moment from "moment";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { customersApi } from "../../api/customers";
import { ConfirmationDialog } from "../../components/confirmation-dialog";
import { ResourceError } from "../../components/resource-error";
import { ResourceUnavailable } from "../../components/resource-unavailable";
import { useDialog } from "../../hooks/use-dialog";
import { useMounted } from "../../hooks/use-mounted";
import { paths } from "../../paths";

const tabOptions = [
  {
    label: "System",
    path: paths.dashboard.settings.index,
  },
  {
    label: "Rates",
    path: paths.dashboard.settings.rates,
  },
  {
    label: "Organizaion",
    path: paths.dashboard.settings.organizations.index,
  },
 
];

const useCustomerStore = () => {
  const isMounted = useMounted();
  const [state, setState] = useState<{
    isLoading?: boolean;
    data?: any;
    error?: string;
  }>({
    isLoading: true,
  });

  const handleCustomerGet = useCallback(async () => {
    setState({ isLoading: true });

    try {
      const response = await customersApi.getCustomer();

      if (isMounted()) {
        setState({ data: response });
      }
    } catch (err) {
      console.error(err);

      if (isMounted()) {
        setState({ error: "Something went wrong" });
      }
    }
  }, [isMounted]);

  useEffect(
    () => {
      handleCustomerGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    state,
  };
};

const getResourcesState = (storeState: any) => {
  if (storeState.isLoading) {
    return "loading";
  }

  if (storeState.error) {
    return "error";
  }

  return storeState.data ? "available" : "unavailable";
};

type LayoutPropTypes = {
  children: ReactNode;
};

export const Layout = (props: LayoutPropTypes) => {
  const { children } = props;
  const router = useRouter();
  const pathname = usePathname();
  const customerStore = useCustomerStore();
  const banDialog = useDialog();

  const handleVerificationSend = useCallback(() => {
    toast.error("This action is not available on demo");
  }, []);

  const handlePasswordResetSend = useCallback(() => {
    toast.error("This action is not available on demo");
  }, []);

  const handleAccountBan = useCallback(() => {
    banDialog.handleClose();
    toast.error("This action is not available on demo");
  }, [banDialog]);

  const handleTabsChange = useCallback(
    (event: any, value: any) => {
      router.push(value);
    },
    [router]
  );

  const currentTab = tabOptions.find((option) => option.path === pathname);

  const resourcesState = getResourcesState(customerStore.state);

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl" sx={{ height: "100%" }}>
          {resourcesState === "loading" && (
            <div>
              <Skeleton height={42} />
              <Skeleton />
              <Skeleton />
            </div>
          )}
          {resourcesState === "error" && (
            <ResourceError message="Something went wrong" />
          )}
          {resourcesState === "unavailable" && (
            <ResourceUnavailable message="Resources are not available" />
          )}
          {resourcesState === "available" && (
            <Stack spacing={4} sx={{ height: "100%" }}>
              <Stack spacing={2}>
                <div>
                  <Button
                    color="inherit"
                    component={NextLink}
                    href={paths.dashboard.index}
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowLeftIcon />
                      </SvgIcon>
                    }
                  >
                    Overview
                  </Button>
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
          )}
        </Container>
      </Box>
      <ConfirmationDialog
        message="Are you sure you want to ban this account? This can't be undone."
        onCancel={banDialog.handleClose}
        onConfirm={handleAccountBan}
        open={banDialog.open}
        title="Ban Customer"
        variant="error"
      />
    </>
  );
};
