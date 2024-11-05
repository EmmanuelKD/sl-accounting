"use client";
import { ERROR_MESSAGE } from "@/const";
import { removeUserFromWorkspaceAction } from "@/lib/actions/workspace-actions";
import { HttpError } from "@/utils/errorHandler";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { User, Workspace } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";

interface WorkspaceDetailProps {
  open: boolean;
  onClose: () => void;
  workspace: (Workspace & { users: User[] }) | null;
  onUpdate: (workspace: Workspace & { users: User[] }) => void;
}

export default function WorkspaceDetail({
  open,
  onClose,
  workspace,
  onUpdate,
}: WorkspaceDetailProps) {
  const [workspaceUsers, setWorkspaceUsers] = useState<User[]>(
    workspace?.users || []
  );
  if (!workspace) return null;

  const handleRemoveUser = async (user: User) => {
    try {
      await removeUserFromWorkspaceAction(workspace.id, user?.id as string);
      setWorkspaceUsers(workspaceUsers.filter((u) => u.id !== user.id));
    } catch (error) {
      if (error instanceof HttpError) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGE);
      }
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{workspace.name}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Created: {new Date(workspace.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Last Updated: {new Date(workspace.updatedAt).toLocaleString()}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Users:
        </Typography>
        <List>
          {workspaceUsers.map((user: User) => (
            <ListItem key={user.id}>
              <ListItemText primary={user.name} secondary={user.email} />
              <Button onClick={() => handleRemoveUser(user)} color="error">
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={() => onUpdate(workspace)}
          color="primary"
          variant="contained"
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
