import { Scrollbar } from "@/components/scrollbar";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  SvgIcon
} from "@mui/material";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";

const SIDE_NAV_WIDTH = 270;
const SIDE_NAV_COLLAPSED_WIDTH = 73; // icon size + padding + border right
const TOP_NAV_HEIGHT = 64;

const renderItems = ({
  collapse = false,
  depth = 0,
  items,
  pathname,
}: {
  depth: number;
  items: any[];
  pathname: any;
  collapse: boolean;
}) =>
  items.reduce(
    (acc, item) =>
      reduceChildRoutes({
        acc,
        collapse,
        depth,
        item,
        pathname,
      }),
    []
  );

const reduceChildRoutes = ({
  acc,
  collapse,
  depth,
  item,
  pathname,
}: {
  acc: any[];
  depth: number;
  item: any;
  pathname: any;
  collapse: boolean;
}) => {
  const checkPath = !!(item.path && pathname);
  const partialMatch = checkPath ? pathname.includes(item.path) : false;
  const exactMatch = checkPath ? pathname === item.path : false;

  if (item.items) {
    acc.push(
      <SideNavItem
        active={partialMatch}
        collapse={collapse}
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
          {renderItems({
            collapse,
            depth: depth + 1,
            items: item.items,
            pathname,
          })}
        </Stack>
      </SideNavItem>
    );
  } else {
    acc.push(
      <SideNavItem
        active={exactMatch}
        collapse={collapse}
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
type SideNavPropTypes = {
  onPin: () => void;
  pinned: boolean;
};

export const SideNav = (props: SideNavPropTypes) => {
  const { onPin, pinned = false } = props;
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  const collapse = !(pinned || hovered);

  const imageWidth = collapse
    ? (32 / 100) * SIDE_NAV_COLLAPSED_WIDTH
    : (20 / 100) * SIDE_NAV_WIDTH;

  // const { selectedOrg, orgLoading } = useContext(OrgContext);
  const { data: session } = useSession();
  return (
    <Drawer
      id="drawerMain"
      open
      variant="permanent"
      PaperProps={{
        onMouseEnter: () => {
          setHovered(true);
        },
        onMouseLeave: () => {
          setHovered(false);
        },
        sx: {
          backgroundColor: "background.main",
          // backgroundColor: 'neutral.900',
          height: `calc(100% - ${TOP_NAV_HEIGHT}px)`,
          overflowX: "hidden",
          top: TOP_NAV_HEIGHT,
          transition: "width 250ms ease-in-out",
          width: collapse ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_WIDTH,
          zIndex: (theme) => theme.zIndex.appBar - 100,
        },
      }}
    >
      <Scrollbar
        sx={{
          height: "100%",
          overflowX: "hidden",
          "& .simplebar-content": {
            height: "100%",
          },
        }}
      >
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
            <Stack
              gap={3}
              direction={"row"}
              alignItems={"center"}
              sx={{
                my: (th) => th.spacing(3),
                bgcolor: "neutral.200",
                color: "neutral.600",
                p: (th) => th.spacing(1),
                borderRadius: 1,
                width: '100%',
                flexWrap: 'wrap',
              }}
            >
              {!session?.user ? (
                <Skeleton
                  variant="rectangular"
                  sx={{
                    height: imageWidth,
                    width: imageWidth,
                  }}
                />
              ) : (
                <Avatar
                  variant="rounded"
                  sx={{
                    height: imageWidth,
                    width: imageWidth,
                    backgroundSize: "contain",
                  }}
                  alt="org logo"
                  src={session?.user?.imgUrl ?? "/admin-banner.png"}
                  // sx={{ width: 80, height: 80 }}
                />
              )}

              {!session?.user ? (
                <Skeleton variant="text" width={100} height={20} />
              ) : (
                <SelectWorkspace />
                // <Typography variant="h6">
                //   {session?.user.name ?? "ADMIN"}
                // </Typography>
              )}
            </Stack>

            {renderItems({
              collapse,
              depth: 0,
              items,
              pathname,
            })}
          </Box>
          <Divider />
          <Box sx={{ pt: 1 }}>
            <IconButton onClick={onPin}>
              <SvgIcon fontSize="small">
                {pinned ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </SvgIcon>
            </IconButton>
          </Box>
        </Box>
      </Scrollbar>
    </Drawer>
  );
};

function SelectWorkspace() {
  const { data: session, update } = useSession();
  const [currentWorkspace, setcurrentWorkspace] = useState("");

  useEffect(() => {
    // Set initial selected workspace from session or first workspace
    if (session)
      if ((session?.user?.workspaces?.length ?? 0) > 0) {
        const initialWorkspace =
          session.user.currentWorkspace || session.user.workspaces[0].id;
        setcurrentWorkspace(initialWorkspace);
      }
  }, [session]);

  const handleChange = async (event: SelectChangeEvent) => {
    const workspaceId = event.target.value;
    setcurrentWorkspace(workspaceId);

    // Update session with selected workspace
    await update({
      ...session,
      user: {
        ...session?.user,
        currentWorkspace: workspaceId,
      },
    });
  };

  return (
    <FormControl 
      variant="standard" 
      sx={{ 
        minWidth: 100,
        maxWidth: '100%',
        m: 1,
        '& .MuiSelect-select': {
          maxWidth: '150px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }
      }}
    >
      <InputLabel id="workspace-select-label">Workspace</InputLabel>
      <Select
        labelId="workspace-select-label"
        id="workspace-select"
        value={currentWorkspace}
        onChange={handleChange}
        label="Workspace"
      >
        {session?.user?.workspaces?.map((workspace) => (
          <MenuItem 
            key={workspace.id} 
            value={workspace.id}
            sx={{
              maxWidth: '250px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {workspace.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
