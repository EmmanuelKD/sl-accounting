import { getAllUsersAction } from "@/lib/actions/auth";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { User, Workspace } from "@prisma/client";
import { useEffect, useState } from "react";

interface WorkspaceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    workspace: Omit<
      Workspace & { users: User[] },
      "id" | "createdAt" | "updatedAt"
    >
  ) => void;
  workspace?: (Workspace & { users: User[] }) | null;
}

export default function WorkspaceForm({
  open,
  onClose,
  onSubmit,
  workspace,
}: WorkspaceFormProps) {
  const [name, setName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<
    Omit<User, "createdAt" | "updatedAt">[]
  >([]);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setUsers(workspace.users ?? []);
    } else {
      setName("");
      setUsers([]);
    }
  }, [workspace]);

 
  const fetchUsers = async () => {
    const fetchedUsers = await getAllUsersAction();
    setAllUsers(fetchedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = () => {
  
      onSubmit({
        name,
        users,
      });
      onClose();
 
  };

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <DialogTitle>
        {workspace ? "Edit Workspace" : "Create Workspace"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Workspace Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Autocomplete
          multiple
          id="users"
          options={allUsers}
          getOptionLabel={(option) => option.name}
          value={users}
          onChange={(_, newValue) => setUsers(newValue as User[])}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Assign Users"
              placeholder="Search users"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {workspace ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
