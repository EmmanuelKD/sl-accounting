"use client";

import { Add } from "@mui/icons-material";
import {
  Button,
  Container,
  Grid,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import { useState } from "react";
import AddEditEmployeeForm from "./employees/AddEditEmployeeForm";
import ConfirmDialog from "./employees/ConfirmDialog";
import EmployeeProfile from "./employees/EmployeeProfile";

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
import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "./employees/employeeAction";
import { Department, Employee, EmploymentStatus, Role } from "./employeeTypes";

 
// const drawerWidth = 240;

export default function HRManagement() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
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
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees");
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "All" || employee.department === filterDepartment;
    const matchesRole = filterRole === "All" || employee.role === filterRole;
    const matchesStatus =
      filterStatus === "All" || employee.status === filterStatus;

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

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
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
        await deleteEmployee(employeeToDelete.id);
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

  const handleSaveEmployee = async (employeeData: Employee) => {
    try {
      if (employeeData.id) {
        await updateEmployee(employeeData);
        toast.success( "Employee updated successfully" );
      } else {
        await addEmployee(employeeData);
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddEmployee}
           
        >
          Add Employee
        </Button>
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
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.status}
                      color={
                        employee.status === "Active"
                          ? "success"
                          : employee.status === "On Leave"
                          ? "warning"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(employee.hireDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
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
