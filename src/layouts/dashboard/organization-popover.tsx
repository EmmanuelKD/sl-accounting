import { useCallback } from "react";
import ChevronUpDownIcon from "@heroicons/react/24/outline/ChevronUpDownIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import NextLink from "next/link";

import {
  Button,
  ButtonBase,
  Divider,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  SvgIcon,
  Typography,
} from "@mui/material";
import { common } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import { usePopover } from "../../hooks/use-popover";
import { paths } from "../../paths";

type OrganizationPopoverPropTypes = {
  onOrganizationSwitch: (organizationId: string) => void;
  organizationId: string;
  organizations: any;
};
export const OrganizationPopover = (props: OrganizationPopoverPropTypes) => {
  const { onOrganizationSwitch, organizationId, organizations = [] } = props;
  const popover = usePopover();

  const handleOrganizationChange = useCallback(
    (organizationId: string) => {
      popover.handleClose();
      onOrganizationSwitch?.(organizationId);
    },
    [popover, onOrganizationSwitch]
  );

  // NOTE: Ensure an organization is found, otherwise some components will fail.
  const organization = organizations.find(
    (organization:any) => organization.id === organizationId
  );

  return (
    <>
      <ButtonBase
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{
          backgroundColor: alpha(common.white, 0.05),
          borderRadius: 1,
          display: "flex",
          px: "12px",
          py: "6px",
          "&:hover": {
            backgroundColor: alpha(common.white, 0.1),
          },
        }}
      >
        <Typography
          component="span"
          color="inherit"
          sx={{
            fontSize: 14,
            lineHeight: "24px",
          }}
        >
          {organization.name}
        </Typography>
        <SvgIcon color="action" fontSize="small" sx={{ ml: 3 }}>
          <ChevronUpDownIcon />
        </SvgIcon>
      </ButtonBase>
      <Popover
        anchorEl={popover.anchorRef.current}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        disableScrollLock
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{
          sx: {
            p: 1,
            width: 160,
          },
        }}
      >
        <MenuList dense sx={{ p: 0 }}>
          {organizations.map((organization:any) => {
            const isSelected = organization.id === organizationId;

            return (
              <MenuItem
                key={organization.id}
                onClick={() => handleOrganizationChange?.(organization.id)}
                selected={isSelected}
                sx={{ borderRadius: 1 }}
              >
                <ListItemText>{organization.name}</ListItemText>
              </MenuItem>
            );
          })}
        </MenuList>
        <Divider sx={{ my: 1 }} />
        <Button
          component={NextLink}
           href={paths.dashboard.workspace.add_workspace}         
           fullWidth
          color="inherit"
          size="small"
          onClick={popover.handleClose}
          startIcon={
            <SvgIcon fontSize="small">
              <PlusIcon />
            </SvgIcon>
          }
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
          }}
        >
          Create App
        </Button>
      </Popover>
    </>
  );
};
