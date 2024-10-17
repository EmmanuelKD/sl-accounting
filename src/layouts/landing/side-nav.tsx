import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
// import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import {
  Box,
  Button,
  ButtonBase,
  Drawer,
  IconButton,
  Stack,
  SvgIcon,
} from "@mui/material";
import { paths } from "../../paths";
import { SideNavItem } from "./side-nav-item";
// import { Logo } from "../../components/logo";

const items = [
  {
    title: "Products",
    children: [
      {
        title: "List",
        path: paths.dashboard.products.index,
      },
      {
        title: "Summary",
        path: paths.dashboard.products.details.index,
      },
      {
        title: "Inventory",
        path: paths.dashboard.products.details.inventory,
      },
      {
        title: "Insights",
        path: paths.dashboard.products.details.insights,
      },
    ],
  },
  {
    title: "Orders",
    children: [
      {
        title: "List",
        path: paths.dashboard.orders.index,
      },
      {
        title: "Summary",
        path: paths.dashboard.orders.details,
      },
    ],
  },
  {
    title: "Customers",
    children: [
      {
        title: "List",
        path: paths.dashboard.customers.index,
      },
      {
        title: "Summary",
        path: paths.dashboard.customers.details.index,
      },
      {
        title: "Orders",
        path: paths.dashboard.customers.details.orders,
      },
      {
        title: "Activity",
        path: paths.dashboard.customers.details.activity,
      },
    ],
  },
  {
    title: "Invoices",
    children: [
      {
        title: "List",
        path: paths.dashboard.invoices.index,
      },
      {
        title: "Create",
        path: paths.dashboard.invoices.create,
      },
      {
        title: "Details",
        path: paths.dashboard.invoices.details.index,
      },
      {
        title: "Preview",
        path: paths.dashboard.invoices.details.preview,
      },
    ],
  },
  {
    title: "Dashboards",
    children: [
      {
        title: "Overview",
        path: paths.dashboard.index,
      },
      {
        title: "Reports",
        path: paths.dashboard.sales,
      },
    ],
  },
  {
    title: "Account",
    children: [
      {
        title: "General",
        path: paths.dashboard.account.index,
      },
      {
        title: "Notifications",
        path: paths.dashboard.account.notifications,
      },
    ],
  },
  {
    title: "Organization",
    children: [
      {
        title: "General",
        path: paths.dashboard.organization.index,
      },
      {
        title: "Team",
        path: paths.dashboard.organization.team,
      },
      {
        title: "Billing",
        path: paths.dashboard.organization.billing,
      },
    ],
  },
  // {
  //   title: "Docs",
  //   path: paths.docs.welcome,
  //   external: true,
  // },
];

const renderItems = ({
  depth = 0,
  items,
  pathname,
}: {
  depth?: number;
  items: any[];
  pathname: any;
}) =>
  items.reduce(
    (acc, item) =>
      reduceChildRoutes({
        acc,
        depth,
        item,
        pathname,
      }),
    []
  );

const reduceChildRoutes = ({
  acc,
  depth,
  item,
  pathname,
}: {
  acc: any[];
  depth: number;
  item: any;
  pathname: any;
}) => {
  const checkPath = !!(item.path && pathname);
  const partialMatch = checkPath ? pathname.includes(item.path) : false;
  const exactMatch = checkPath ? pathname === item.path : false;

  if (item.children) {
    const children = item.children.map((child: any) => {
      const checkPath = !!(child.path && pathname);
      const active = checkPath ? pathname === child.path : false;

      const linkProps = child.path
        ? child.external
          ? {
              component: "a",
              href: child.path,
              target: "_blank",
            }
          : {
              component: NextLink,
              href: child.path,
            }
        : {};

      return (
        <li key={child.title}>
          <ButtonBase
            sx={{
              alignItems: "center",
              borderRadius: 1,
              display: "flex",
              justifyContent: "flex-start",
              p: "8px",
              textAlign: "left",
              "&:hover": {
                backgroundColor: "action.hover",
              },
              ...(active && {
                color: "primary.main",
              }),
            }}
            {...linkProps}
          >
            <Box
              component="span"
              sx={{
                height: 6,
                mr: 2,
                width: 6,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "neutral.400",
                  borderRadius: "50%",
                  height: 4,
                  opacity: 0,
                  width: 4,
                  ...(active && {
                    backgroundColor: "primary.main",
                    height: 6,
                    opacity: 1,
                    width: 6,
                  }),
                }}
              />
            </Box>
            <Box
              component="span"
              sx={{
                color: "text.secondary",
                flexGrow: 1,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: 13,
                fontWeight: 500,
                lineHeight: "24px",
                whiteSpace: "nowrap",
              }}
            >
              {child.title}
            </Box>
          </ButtonBase>
        </li>
      );
    });

    acc.push(
      <SideNavItem
        active={partialMatch}
        external={item.external}
        key={item.title}
        openImmediately={partialMatch}
        path={item.path}
        title={item.title}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
          }}
        >
          {children}
        </Stack>
      </SideNavItem>
    );
  } else {
    acc.push(
      <SideNavItem
        active={exactMatch}
        external={item.external}
        key={item.title}
        path={item.path}
        title={item.title}
      />
    );
  }

  return acc;
};

type SideNavPropTypes = {
  onClose: () => void;
  open: boolean;
};

export const SideNav = (props: SideNavPropTypes) => {
  const { onClose, open } = props;
  const pathname = usePathname();

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          width: 256,
        },
      }}
      variant="temporary"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pt: 2,
          px: 3,
        }}
      >
        <Box
          component={NextLink}
          href={paths.index}
          sx={{
            display: "inline-flex",
            height: 24,
            width: 24,
          }}
        >
          {"logo"}
          {/* <Logo color="primary" /> */}
        </Box>
        <IconButton onClick={onClose}>
          <SvgIcon fontSize="small">{/* <XMarkIcon /> */}i</SvgIcon>
        </IconButton>
      </Stack>
      <Box component="nav" sx={{ p: 2 }}>
        <Stack
          component="ul"
          spacing={1}
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
          }}
        >
          {renderItems({ items, pathname })}
        </Stack>
      </Box>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Button
          color="inherit"
          component={NextLink}
          href={paths.dashboard.index}
          variant="outlined"
        >
          Get Started
        </Button>
        {/* <Button
          component="a"
          href="https://mui.com/store/items/carpatin-dashboard"
          target="_blank"
          variant="contained"
        >
          Purchase
        </Button> */}
      </Stack>
    </Drawer>
  );
};
