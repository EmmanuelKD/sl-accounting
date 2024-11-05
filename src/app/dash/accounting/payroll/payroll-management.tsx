"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Chip,
  TablePagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Edit,
  Visibility,
  AttachMoney,
  AccountBalance,
  Paid,
} from "@mui/icons-material";

// Dummy data for employees and payroll entries
const employees = [
  { id: 101, name: "John Doe", salary: 3000 },
  { id: 102, name: "Jane Smith", salary: 4000 },
];

const initialPayrollEntries = [
  {
    id: 1,
    employeeId: 101,
    employeeName: "John Doe",
    salary: 3000,
    payPeriod: "Sep 2024",
    deductions: 200,
    netPay: 2800,
    status: "Paid",
  },
  {
    id: 2,
    employeeId: 102,
    employeeName: "Jane Smith",
    salary: 4000,
    payPeriod: "Sep 2024",
    deductions: 200,
    netPay: 3800,
    status: "Unpaid",
  },
];

export default function PayrollManagement() {
  const [payrollEntries, setPayrollEntries] = useState(initialPayrollEntries);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newPayroll, setNewPayroll] = useState({
    employeeId: "",
    salary: "",
    payPeriod: null,
    deductions: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleCreatePayroll = () => {
    // Validate form fields
    if (!newPayroll.employeeId || !newPayroll.salary || !newPayroll.payPeriod) {
      alert("Please fill in all required fields");
      return;
    }

    const employee = employees.find((emp) => emp.id === newPayroll.employeeId);
    if (!employee) return;

    const newEntry = {
      id: payrollEntries.length + 1,
      employeeId: employee.id,
      employeeName: employee.name,
      salary: parseFloat(newPayroll.salary),
      payPeriod: newPayroll.payPeriod.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      }),
      deductions: parseFloat(newPayroll.deductions) || 0,
      netPay:
        parseFloat(newPayroll.salary) -
        (parseFloat(newPayroll.deductions) || 0),
      status: "Unpaid",
    };

    setPayrollEntries([...payrollEntries, newEntry]);
    handleCloseDialog();
    setNewPayroll({
      employeeId: "",
      salary: "",
      payPeriod: null,
      deductions: "",
    });
  };

  const filteredPayrollEntries = payrollEntries.filter(
    (entry) =>
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.payPeriod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const totalPayroll = payrollEntries.reduce(
    (sum, entry) => sum + entry.salary,
    0
  );
  const totalDeductions = payrollEntries.reduce(
    (sum, entry) => sum + entry.deductions,
    0
  );
  const totalNetPay = payrollEntries.reduce(
    (sum, entry) => sum + entry.netPay,
    0
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Payroll Management
          </Typography>
          <Button color="inherit" onClick={handleOpenDialog}>
            Create Payroll
          </Button>
        </Toolbar>

        <Grid container spacing={3} sx={{ mt: 2, px: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Payroll
                </Typography>
                <Typography variant="h4" color="primary">
                  <AttachMoney /> ${totalPayroll.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Deductions
                </Typography>
                <Typography variant="h4" color="secondary">
                  <AccountBalance /> ${totalDeductions.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Net Pay
                </Typography>
                <Typography variant="h4" color="success.main">
                  <Paid /> ${totalNetPay.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2, px: 2 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search by Employee Name or Pay Period"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="payroll table">
                <TableHead>
                  <TableRow>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Salary Amount</TableCell>
                    <TableCell>Pay Period</TableCell>
                    <TableCell>Deductions</TableCell>
                    <TableCell>Net Pay</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayrollEntries
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.employeeName}</TableCell>
                        <TableCell>{entry.employeeId}</TableCell>
                        <TableCell>${entry.salary.toFixed(2)}</TableCell>
                        <TableCell>{entry.payPeriod}</TableCell>
                        <TableCell>${entry.deductions.toFixed(2)}</TableCell>
                        <TableCell>${entry.netPay.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={entry.status}
                            color={
                              entry.status === "Paid" ? "success" : "warning"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton color="primary" aria-label="edit">
                            <Edit />
                          </IconButton>
                          <IconButton color="secondary" aria-label="view">
                            <Visibility />
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
              count={filteredPayrollEntries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Create New Payroll Entry</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) =>
                    `${option.name} (ID: ${option.id})`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select Employee" required />
                  )}
                  onChange={(event, newValue) => {
                    setNewPayroll({
                      ...newPayroll,
                      employeeId: newValue ? newValue.id : "",
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Salary Amount"
                  type="number"
                  value={newPayroll.salary}
                  onChange={(e) =>
                    setNewPayroll({ ...newPayroll, salary: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label="Pay Period"
                  views={["year", "month"]}
                  value={newPayroll.payPeriod}
                  onChange={(newValue) =>
                    setNewPayroll({ ...newPayroll, payPeriod: newValue })
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deductions"
                  type="number"
                  value={newPayroll.deductions}
                  onChange={(e) =>
                    setNewPayroll({ ...newPayroll, deductions: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Net Pay: $
                  {(
                    parseFloat(newPayroll.salary) -
                    (parseFloat(newPayroll.deductions) || 0)
                  ).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleCreatePayroll}
              variant="contained"
              color="primary"
            >
              Create Payroll
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
}
