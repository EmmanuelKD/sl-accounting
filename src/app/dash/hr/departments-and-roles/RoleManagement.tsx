import {
  createRoleAction,
  updateRoleAction
} from "@/lib/actions/core-accounting/role-management-actions";
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Department, Role } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { RoleWithDepartment } from "./page";

export default function RoleManagement({
  paramsRoles,
  departments,
}: {
  paramsRoles: RoleWithDepartment[];
  departments: Department[];
}) {

  const [roles, setRoles] = useState<RoleWithDepartment[]>(paramsRoles);
  const [newRole, setNewRole] = useState<
    Omit<RoleWithDepartment, "id" | "departmentId" | "workspaceId">
  >({ title: "", level: 1, department: { id: "", name: "" } });
  const [editingRole, setEditingRole] = useState<RoleWithDepartment | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleWithDepartment | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    // alert(name)
    if (name === "departmentId") {
      const department = departments.find((d) => d.id === value);
      setNewRole((prev) => ({
        ...prev,
        department: {
          id: value as string,
          name: department?.name || "",
        },
      }));
    } else {
      setNewRole((prev) => ({
        ...prev,
        [name as string]: name === "level" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole.title && newRole.department) {
      const workspaceId = "cm2el4sot0002nhcysia1pnfu";
      // todo: use useOptimistic

      const createdRole = await createRoleAction(
        newRole.title,
        newRole.department.id,
        workspaceId
      );

      roles.push(createdRole as unknown as RoleWithDepartment);
      setRoles([
        ...(roles as RoleWithDepartment[]),
        {
          ...newRole,
          id: "",
          departmentId: "",
          workspaceId: "",
        },
      ]);
      setNewRole({ title: "", level: 1, department: { id: "", name: "" } });
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role as RoleWithDepartment);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name === "department") {
      const department = departments.find((d) => d.id === value);
      setEditingRole((prev) =>
        prev
          ? {
              ...prev,
              department: {
                id: value as string,
                name: department?.name || "",
              },
            }
          : null
      );
    } else {
      setEditingRole((prev) =>
        prev
          ? {
              ...prev,
              [name as string]: name === "level" ? Number(value) : value,
            }
          : null
      );
    }
  };

  const handleEditSave = async () => {
    if (editingRole) {
      await updateRoleAction(
        editingRole.id,
        editingRole.title,
        editingRole.department.id
      );
      setRoles(
        roles.map((role) => (role.id === editingRole.id ? editingRole : role))
      );
      setEditingRole(null);
    }
  };

  const handleDeleteConfirm = (role: Role) => {
    setRoleToDelete(role as RoleWithDepartment);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (roleToDelete) {
      setRoles(roles.filter((role) => role.id !== roleToDelete.id));
      setDeleteConfirmOpen(false);
      setRoleToDelete(null);
    }
  };

  useEffect(() => {
    setRoles(paramsRoles);
  }, [paramsRoles]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5" component="h2" gutterBottom>
          Manage Roles
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            name="title"
            label="Title"
            value={newRole.title}
            onChange={handleInputChange}
            required
            sx={{ mr: 2, mb: 2 }}
          />
          <TextField
            name="level"
            label="Level"
            type="number"
            value={newRole.level}
            onChange={handleInputChange}
            required
            sx={{ mr: 2, mb: 2 }}
          />
          <FormControl sx={{ minWidth: 120, mr: 2, mb: 2 }}>
            <InputLabel>Department</InputLabel>
            <Select
              name="departmentId"
              value={newRole.department.id}
              onChange={handleInputChange}
              required
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Add Role
          </Button>
        </form>
      </Stack>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Title</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  {editingRole && editingRole.id === role.id ? (
                    <TextField
                      name="title"
                      value={editingRole.title}
                      onChange={handleEditChange}
                      fullWidth
                    />
                  ) : (
                    role.title
                  )}
                </TableCell>
                <TableCell>
                  {editingRole && editingRole.id === role.id ? (
                    <TextField
                      name="level"
                      type="number"
                      value={editingRole.level}
                      onChange={handleEditChange}
                      fullWidth
                    />
                  ) : (
                    role.level
                  )}
                </TableCell>
                <TableCell>
                  {editingRole && editingRole.id === role.id ? (
                    <FormControl fullWidth>
                      <Select
                        name="department"
                        value={editingRole.department?.id || ""}
                        onChange={handleEditChange}
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : role.department ? (
                    role.department.name
                  ) : (
                    "No Department"
                  )}
                </TableCell>
                <TableCell>
                  {editingRole && editingRole.id === role.id ? (
                    <Button onClick={handleEditSave} color="primary">
                      Save
                    </Button>
                  ) : (
                    <>
                      <IconButton
                        onClick={() => handleEdit(role)}
                        // color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteConfirm(role)}
                        // color="secondary"
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this role?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
