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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
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
import { styled } from "@mui/material/styles";
import { User, Workspace } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

type UserWithWorkspaces = User & { workspaces: Workspace[] };

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[0-9]/, "Password requires at least one number")
    .matches(/[a-z]/, "Password requires at least one lowercase letter")
    .matches(/[A-Z]/, "Password requires at least one uppercase letter")
    .matches(/[^\w]/, "Password requires at least one symbol"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .when("password", {
      is: (val: string) => val?.length > 0,
      then: (schema) => schema.required("Confirm Password is required"),
    }),
  profilePhoto: Yup.mixed()
    .test(
      "fileSize",
      "File is too large",
      (value: ({ size: number } & any) | undefined) => {
        if (!value) return true;
        return value.size <= 5000000; // 5MB limit
      }
    )
    .test(
      "fileType",
      "Unsupported file format",
      (value: ({ type: string } & any) | undefined) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }
    ),
});

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("profilePhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleUpdateUser = async (
    user: Omit<UserWithWorkspaces, "createdAt" | "updatedAt">
  ) => {
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

  // const validationSchema = Yup.object().shape({
  //   fullName: Yup.string().required("Full name is required"),
  //   password: Yup.string().min(6, "Password must be at least 6 characters"),
  //   confirmPassword: Yup.string().oneOf(
  //     [Yup.ref("password"), null],
  //     "Passwords must match"
  //   ),
  //   profilePhoto: Yup.mixed().test("fileSize", "File is too large", (value) => {
  //     if (!value) return true; // Allows empty values
  //     return value.size <= 2000000; // 2MB limit
  //   }),
  // });

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const { data: session } = useSession();

  return (
    <Container maxWidth="lg">
      <>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Settings
        </Typography>

        <Formik
          initialValues={{
            fullName: session?.user?.name,
            password: "",
            confirmPassword: "",
            profilePhoto: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              // Handle form submission here
              console.log(values);
            } catch (error) {
              console.error("Error updating profile:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Profile Photo
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  {previewImage && (
                    <Avatar
                      src={previewImage}
                      alt="Profile preview"
                      sx={{ width: 100, height: 100, marginRight: 2 }}
                    />
                  )}
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleImageChange(e, setFieldValue)
                      }
                      accept="image/*"
                    />
                  </Button>
                </Box>
                {errors.profilePhoto && touched.profilePhoto && (
                  <Typography color="error" variant="caption">
                    {errors.profilePhoto as string}
                  </Typography>
                )}
              </Box>

              <Field
                as={TextField}
                fullWidth
                name="fullName"
                label="Full Name"
                error={touched.fullName && Boolean(errors.fullName)}
                helperText={touched.fullName && errors.fullName}
                margin="normal"
              />

              <Field
                as={TextField}
                fullWidth
                name="password"
                type="password"
                label="New Password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                margin="normal"
              />

              <Field
                as={TextField}
                fullWidth
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                margin="normal"
              />

              <Box mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size={20} /> : null
                  }
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </>
      <div
        style={{ display: session?.user?.role === "ADMIN" ? "block" : "none" }}
      >
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
      </div>
    </Container>
  );
}
