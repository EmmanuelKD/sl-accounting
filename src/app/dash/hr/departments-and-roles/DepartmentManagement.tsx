"use client";

import {
  createDepartmentAction,
  deleteDepartmentAction,
  getDepartmentsAction,
  updateDepartmentAction,
} from "@/lib/actions/core-accounting/department-management-actions";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Department } from "@prisma/client";
import React, { useEffect, useState } from "react";
import DeleteConfirmationDialog from "./components/ConfirmDeleteDepartment";
import DepartmentModal from "./components/DepartmentModal";

export default function DepartmentManagementPage({
  // roles,
  paramsDepartments,
}: {
  // roles: RoleWithDepartment[];
  paramsDepartments: Department[];
}) {
  const [departments, setDepartments] =
    useState<Department[]>(paramsDepartments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    //comewhere we call get workspace id
    const workspaceId = "cm2el4sot0002nhcysia1pnfu";
    const fetchedDepartments = await getDepartmentsAction(workspaceId);
    setDepartments(fetchedDepartments.departments);
  };

  const handleOpenModal = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
  };

  const handleSaveDepartment = async (department: Department) => {
    if (editingDepartment) {
      await updateDepartmentAction(
        department.id,
        department.name,
        department.description as string
      );
    } else {
      await createDepartmentAction(
        department.name,
        department.workspaceId,
        department.description as string
      );
    }
    handleCloseModal();
    loadDepartments();
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = (department: Department) => {
    setDepartmentToDelete(department);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (departmentToDelete) {
      await deleteDepartmentAction(departmentToDelete.id);
      setIsDeleteDialogOpen(false);
      loadDepartments();
    }
  };

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
    <>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5" component="h2" gutterBottom>
          Manage Departments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          sx={{ mb: 2 }}
        >
          Add New Department
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table aria-label="department table">
          <TableHead>
            <TableRow>
              <TableCell>Department Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((department) => (
                <TableRow key={department.id}>
                  <TableCell component="th" scope="row">
                    {department.name}
                  </TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditDepartment(department)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteDepartment(department)}
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
        count={departments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <DepartmentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDepartment}
        department={editingDepartment}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        departmentName={departmentToDelete?.name || ""}
      />
    </>
  );
}
