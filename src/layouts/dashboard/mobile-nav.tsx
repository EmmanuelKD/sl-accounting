import { Box, Drawer, Stack } from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
 import { Scrollbar } from "@/components/scrollbar";
import { paths } from "../../paths";
import { items } from "./config";
import { MobileNavItem } from "./mobile-nav-item";
import Logo from "@/components/logo/Logo";
  
const MOBILE_NAV_WIDTH = 280;

const renderItems = ({
  depth = 0,
  items,
  pathname,
}: {
  depth: number;
  items: unknown[];
  pathname: unknown;
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
  acc: any;
  depth: number;
  item: any;
  pathname: any;
}) => {
  const checkPath = !!(item.path && pathname);
  const partialMatch = checkPath ? pathname.includes(item.path) : false;
  const exactMatch = checkPath ? pathname === item.path : false;

  
  if (item.items) {
    acc.push(
      <MobileNavItem
        active={partialMatch}
        depth={depth}
        external={item.external}
        icon={item.icon}
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
          {/* @ts-expect-error unk */}
          {renderItems({
            depth: depth + 1,
            items: item.items,
            pathname,
          })}
        </Stack>
      </MobileNavItem>
    );
  } else {
    acc.push(
      <MobileNavItem
        active={exactMatch}
        depth={depth}
        external={item.external}
        icon={item.icon}
        key={item.title}
        path={item.path}
        title={item.title}
      />
    );
  }

  return acc;
};

type MobileNavPropTypes = {
  onClose: () => void;
  open: boolean;
};

export const MobileNav = (props: MobileNavPropTypes) => {
  const { open, onClose } = props;
  const pathname = usePathname();
 
  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          width: MOBILE_NAV_WIDTH,
        },
      }}
      variant="temporary"
    >
      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
        }}
      >
        <Box
          sx={{
            pt: 2,
            px: 2,
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
            <Logo />
          </Box>
        </Box>
        <Box
          component="nav"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 2,
          }}
        >
          <Box
            component="ul"
            sx={{
              flexGrow: 1,
              listStyle: "none",
              m: 0,
              p: 0,
            }}
          >
            {/* @ts-expect-error unk */}
            {renderItems({
              depth: 0,
              items, 
              pathname: pathname ?? '',
            })}
          </Box>
        </Box>
      </Scrollbar>
    </Drawer>
  );
};
