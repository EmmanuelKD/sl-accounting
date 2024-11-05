"use client";

import { Add } from "@mui/icons-material";
import {
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddEditEmployeeForm from "./AddEditEmployeeForm";
import ConfirmDialog from "./ConfirmDialog";
import EmployeeProfile from "./EmployeeProfile";

import { Delete, Edit } from "@mui/icons-material";
import {
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
// import {
//   addEmployee,
//   deleteEmployee,
//   getEmployees,
//   updateEmployee,
// } from "./employeeAction";
import {
  Department,
  Employee,
  EmploymentStatus,
  Role,
  Benefit,
  Salary,
  MaritalStatus,
  UploadFile,
} from "@prisma/client";
import {
  createEmployeeAction,
  deleteEmployeeAction,
  getEmployeesAction,
  updateEmployeeAction,
} from "@/lib/actions/core-accounting/hr-actions";
import Link from "next/link";
import { paths } from "@/paths";

// const drawerWidth = 240;
export type EmployeeWithRoleDepartmentAndSalary = Employee & {
  Role: { id: string; title: string };
  Department: { id: string; name: string };
  basicSalary: number;
  Benefit: Benefit[];
  salary?: Salary;
  UploadFile: UploadFile[];
  // contactPersonName: string;
  // contactPersonPhone: string;
  uploadedFiles: {
    file: FormData;
    fileName: string;
  }[];
};
export default function HRManagement() {
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeWithRoleDepartmentAndSalary | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<
    EmployeeWithRoleDepartmentAndSalary[]
  >([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [filterDepartment, setFilterDepartment] = useState<Department | "All">(
    "All"
  );
  const [filterRole, setFilterRole] = useState<Role | "All">("All");
  const [filterStatus, setFilterStatus] = useState<EmploymentStatus | "All">(
    "All"
  );

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const workspaceId = "cm2el4sot0002nhcysia1pnfu";
      const data = await getEmployeesAction(workspaceId);
      setEmployees(
        data.employees as unknown as EmployeeWithRoleDepartmentAndSalary[]
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees");
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.Role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.Department.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "All" ||
      employee.Department.name === filterDepartment.name;
    const matchesRole =
      filterRole === "All" || employee.Role.title === filterRole.title;
    const matchesStatus =
      filterStatus === "All" || employee.employmentStatus === filterStatus;

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEmployeeClick = (
    employee: EmployeeWithRoleDepartmentAndSalary
  ) => {
    setSelectedEmployee(employee);
  };

  const handleEditEmployee = (
    employee: EmployeeWithRoleDepartmentAndSalary
  ) => {
    setSelectedEmployee(employee);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteEmployee = (
    employee: EmployeeWithRoleDepartmentAndSalary
  ) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseProfile = () => {
    setSelectedEmployee(null);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsAddEditModalOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployeeAction(employeeToDelete.id);
        fetchEmployees();
        toast.success("Employee deleted successfully");
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Error deleting employee");
      }
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSaveEmployee = async (
    employeeData: EmployeeWithRoleDepartmentAndSalary
  ) => {
    try {
      if (employeeData.id) {
        await updateEmployeeAction(employeeData);
        toast.success("Employee updated successfully");
      } else {
        // alert("create employee");
        const workspaceId = "cm2el4sot0002nhcysia1pnfu";
        await createEmployeeAction({
          id: employeeData.id as string,
          employmentStatus: "ACTIVE",
          workspaceId,
          baseSalary: employeeData.basicSalary,
          dateOfBirth: employeeData.dateOfBirth,
          departmentId: employeeData.departmentId as string,
          email: employeeData.email,
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          roleId: employeeData.roleId as string,
          startDate: employeeData.startDate,
          phone: employeeData.phoneNumber as string,
          maritalStatus: employeeData.maritalStatus as MaritalStatus,
          NIN_Number: employeeData.NIN_Number as string,
          NRA_Tin_Number: employeeData.NRA_Tin_Number as string,
          uploadedFiles:employeeData.uploadedFiles,
          contactPersonName: employeeData.contactPersonName,
          contactPersonPhone: employeeData.contactPersonPhone,

        });
        toast.success("Employee added successfully");
      }
      fetchEmployees();
      setIsAddEditModalOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Error saving employee");
    }
  };
  return (
    <Container>
      <Toolbar>
        <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
          HR Management
        </Typography>
        <Stack direction={"row"} gap={2}>
          <Button
            LinkComponent={Link}
            href={paths.dashboard.hr.departments_and_roles}
            variant="contained"
            color="primary"
            // startIcon={<Add />}
          >
            Department and Roles
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddEmployee}
          >
            Add Employee
          </Button>
        </Stack>
      </Toolbar>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={filterDepartment}
              label="Department"
              onChange={(e) =>
                setFilterDepartment(e.target.value as Department | "All")
              }
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Engineering">Engineering</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Human Resources">Human Resources</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={filterRole}
              label="Role"
              onChange={(e) => setFilterRole(e.target.value as Role | "All")}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Developer">Developer</MenuItem>
              <MenuItem value="Designer">Designer</MenuItem>
              <MenuItem value="Sales Representative">
                Sales Representative
              </MenuItem>
              <MenuItem value="HR Specialist">HR Specialist</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) =>
                setFilterStatus(e.target.value as EmploymentStatus | "All")
              }
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="On Leave">On Leave</MenuItem>
              <MenuItem value="Terminated">Terminated</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employee table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date of Hire</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee) => (
                <TableRow
                  key={employee.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <TableCell component="th" scope="row">
                    {`${employee.firstName} ${employee.lastName}`}
                  </TableCell>
                  <TableCell>{employee.Role.title}</TableCell>
                  <TableCell>{employee.Department.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.employmentStatus}
                      color={
                        employee.employmentStatus === "ACTIVE"
                          ? "success"
                          : employee.employmentStatus === "ON_LEAVE"
                          ? "warning"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(employee.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEmployee(employee);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEmployee(employee);
                      }}
                    >
                      <Delete />
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
        count={filteredEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      /> */}

      <EmployeeProfile
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onClose={handleCloseProfile}
      />

      <AddEditEmployeeForm
        open={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteEmployee}
        title="Confirm Delete"
        content="Are you sure you want to delete this employee? This action cannot be undone."
      />
    </Container>
  );
}
