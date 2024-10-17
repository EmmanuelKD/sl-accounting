import { usePopover } from "@/hooks/use-popover";
import { logout } from "@/lib/actions/auth";
import { paths } from "@/paths";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import BuildingOfficeIcon from "@heroicons/react/24/outline/BuildingOfficeIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import {
  Avatar,
  Box,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Select,
  Stack,
  SvgIcon,
  Switch,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";

const languageOptions = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "German",
    value: "de",
  },
  {
    label: "Spanish",
    value: "es",
  },
];

type AccountPopoverPropTypes = {
  direction: "ltr" | "rtl";
  language: "de" | "en" | "es";
  onDirectionSwitch: () => void;
  onLanguageChange: (value: unknown) => void;
  onThemeSwitch: () => void;
  paletteMode: "dark" | "light";
};

export const AccountPopover = (props: AccountPopoverPropTypes) => {
  const {
    // direction = "ltr",
    language = "en",
    // onDirectionSwitch,
    onLanguageChange,
    onThemeSwitch,
    paletteMode = "light",
    ...other
  } = props;

  const router = useRouter();
  const { data: session } = useSession();
  // const { setSelectedOrg } = useContext(OrgContext);

  const user = session?.user;
  // const user = useMockedUser();

  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const popover = usePopover();

  const handleLanguageChange = useCallback(
    (event: unknown) => {
      // @ts-expect-error unk
      onLanguageChange?.(event.target.value);
    },
    [onLanguageChange]
  );

  const handleLogout = useCallback(async () => {
    try {
      popover.handleClose();

      logout();
      //To do: redirect to login page
      router.push(paths.auth.jwt.login);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }, [session, router, popover]);

  return (
    <>
      <Stack
        {...other}
        alignItems="center"
        direction="row"
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        spacing={2}
        sx={{ cursor: "pointer" }}
      >
        <Avatar
          src={user?.imgUrl}
          variant="rounded"
          sx={{
            height: 40,
            width: 40,
          }}
        />
        {!mdDown && (
          <>
            <Box sx={{ minWidth: 100 }}>
              <Typography color="neutral.400" variant="caption">
                Operation
              </Typography>
              <Typography color="inherit" variant="subtitle2">
                {user?.name}
              </Typography>
            </Box>
            <SvgIcon color="action" fontSize="small">
              <ChevronDownIcon />
            </SvgIcon>
          </>
        )}
      </Stack>
      <Popover
        anchorEl={popover.anchorRef.current}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        disableScrollLock
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ sx: { width: 260 } }}
      >
        {mdDown && (
          <Box sx={{ p: 2 }}>
            {/* <Select
              fullWidth
              native
              onChange={handleOrganizationChange}
              value={organization.id}
            >
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </Select> */}
          </Box>
        )}
        <List>
          <ListItem divider>
            <ListItemAvatar>
              <Avatar variant="rounded" />
            </ListItemAvatar>
            <ListItemText primary={user?.name} secondary={user?.name ?? ""} />
          </ListItem>
          <li>
            <List disablePadding>
              <ListSubheader disableSticky>App Settings</ListSubheader>
              {mdDown && (
                <ListItem>
                  <Select
                    fullWidth
                    native
                    onChange={handleLanguageChange}
                    value={language}
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </ListItem>
              )}
              {mdDown && (
                <ListItem sx={{ py: 0 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paletteMode === "dark"}
                        onChange={onThemeSwitch}
                      />
                    }
                    label="Dark Mode"
                  />
                </ListItem>
              )}
            </List>
          </li>
          <ListItemButton
            component={NextLink}
            divider
            href={paths.dashboard.index}
            onClick={popover.handleClose}
          >
            <ListItemIcon>
              <SvgIcon fontSize="small">
                <BuildingOfficeIcon />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primary="Organization" />
          </ListItemButton>
          <ListItemButton
            component={NextLink}
            href={paths.dashboard.settings.user_management.index}
            divider
            onClick={popover.handleClose}
          >
            <ListItemIcon>
              <SvgIcon fontSize="small">
                <UserIcon />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItemButton>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <SvgIcon fontSize="small">
                <ArrowRightOnRectangleIcon />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItemButton>
        </List>
      </Popover>
    </>
  );
};
