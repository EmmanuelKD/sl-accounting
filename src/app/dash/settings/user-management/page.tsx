"use client";

import DeleteUserConfirmation from "@/components/client-components/users-management/deleteConfirm";
import UserDetail from "@/components/client-components/users-management/user-details";
import UserForm from "@/components/client-components/users-management/user-form";
import { ERROR_MESSAGE } from "@/const";
import {
  createUserAction,
  deleteUserAction,
  getAllUsersAction,
  updateUsersProfileAction,
} from "@/lib/actions/auth";
import { HttpError } from "@/utils/errorHandler";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { User, Workspace } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type UserWithWorkspaces = User & { workspaces: Workspace[] };
export default function UserManagementPage() {
  const [users, setUsers] = useState<UserWithWorkspaces[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithWorkspaces | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await getAllUsersAction();
    setUsers(fetchedUsers);
  };

  const handleCreateUser = async (
    user: Omit<UserWithWorkspaces, "createdAt" | "updatedAt">
  ) => {
    try {
      if (selectedUser) {
        await handleUpdateUser(user);
      } else {
        await createUserAction(user, user.workspaces, window.location.href);
        fetchUsers();
        setIsFormOpen(false);
      }
    } catch (error) {
  
      if (error instanceof HttpError) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGE);
      }
    }
  };

  const handleUpdateUser = async (user: Omit<UserWithWorkspaces, "createdAt" | "updatedAt">) => {
    try {
      await updateUsersProfileAction(user);
      fetchUsers();
      setIsDetailOpen(false);
    } catch (error) {
      if (error instanceof HttpError) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGE);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUserAction(selectedUser.id);
      fetchUsers();
      setIsDeleteConfirmOpen(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mt: 4, mb: 2 }}
      >
        User Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsFormOpen(true)}
        sx={{ mb: 3 }}
      >
        Create User
      </Button>
      <TextField
        fullWidth
        variant="outlined"
        label="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Workspaces</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.workspaces.length}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDetailOpen(true);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedUser(user);
                        setIsFormOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <UserForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateUser}
        user={selectedUser}
      />
      <UserDetail
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedUser}
        onUpdate={handleUpdateUser}
      />
      <DeleteUserConfirmation
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteUser}
      />
    </Container>
  );
}
