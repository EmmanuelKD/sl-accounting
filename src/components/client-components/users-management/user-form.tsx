import {
  getAllWorkspacesAction
} from "@/lib/actions/workspace-actions";
import { saveImageLocally } from "@/utils/files";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { User, UserRole, Workspace } from "@prisma/client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
type UserWithWorkspaces = User & { workspaces: Workspace[] };

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<UserWithWorkspaces, "createdAt" | "updatedAt">) => void;
  user?: UserWithWorkspaces | null;
}

export default function UserForm({
  open,
  onClose,
  onSubmit,
  user,
}: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("VIEWER");
  const [image, setImage] = useState<File | null>(null);
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("VIEWER");
      setImage(null);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = user?.imgUrl;
    const userId = uuidv4();
    if (image) {
      const imagefd = new FormData();
      imagefd.set("image", image);
      imageUrl = await saveImageLocally(imagefd, userId);
    }

    onSubmit({
      id: user?.id ?? userId,
      name,
      email,
      password,
      role,
      imgUrl: imageUrl as string,
      workspaces: user ? user.workspaces : selectedWorkspaces,
    });

    onClose();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<Workspace[]>([]);
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);

  const fetchWorkspaces = async () => {
    const res = await getAllWorkspacesAction();
    setAllWorkspaces(res.workspaces);
  };

  const handleWorkspaceChange = (
    event: React.SyntheticEvent,
    value: Workspace[]
  ) => {
    setSelectedWorkspaces(value);
  };

  useEffect(() => {
    if (open) {
      fetchWorkspaces();
    }
  }, [open]);
  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!user && (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <Autocomplete
            multiple
            id="workspaces"
            options={allWorkspaces}
            getOptionLabel={(option) => option.name}
            value={selectedWorkspaces}
            onChange={handleWorkspaceChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Workspaces"
                placeholder="Add workspaces"
              />
            )}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              required
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="EDITOR">Editor</MenuItem>
              <MenuItem value="VIEWER">Viewer</MenuItem>
              <MenuItem value="ACCOUNTANT">Accountant</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Upload Image
              </Button>
            </label>
            {image && <Box mt={1}>Image selected: {image.name}</Box>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {user ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
