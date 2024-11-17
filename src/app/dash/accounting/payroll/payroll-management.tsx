"use client";

import {
  AccountBalance,
  AttachMoney,
  Edit,
  Paid,
  Visibility,
} from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // Chip,
  Grid,
  IconButton,
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
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";

import { getDepartmentsAction } from "@/lib/actions/core-accounting/department-management-actions";
import { getEmployeesAction } from "@/lib/actions/core-accounting/hr-actions";
import {
  generatePayrollAction,
  getPayrollAction,
} from "@/lib/actions/core-accounting/payroll-actions";
import { Department, Employee, PaymentMode, PayrollItem } from "@prisma/client";
import { toast } from "react-hot-toast";
// import CreatePayrollDialog from "./CreatePayrollDialog";
// // Dummy data for employees and payroll entries
// const employees = [
//   { id: 101, name: "John Doe", salary: 3000 },
//   { id: 102, name: "Jane Smith", salary: 4000 },
// ];

// const initialPayrollEntries = [
//   {
//     id: 1,
//     employeeId: 101,
//     employeeName: "John Doe",
//     salary: 3000,
//     payPeriod: "Sep 2024",
//     deductions: 200,
//     netPay: 2800,
//     status: "Paid",
//   },
//   {
//     id: 2,
//     employeeId: 102,
//     employeeName: "Jane Smith",
//     salary: 4000,
//     payPeriod: "Sep 2024",
//     deductions: 200,
//     netPay: 3800,
//     status: "Unpaid",
//   },
// ];

type PayrollEntryWithEmployee = PayrollItem & {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    department: {
      id: string;
      name: string;
    };
  };
};
export default function PayrollManagement() {
  const [payrollEntries, setPayrollEntries] = useState<
    PayrollEntryWithEmployee[]
  >([]);
  const [employees, setEmployeeData] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  async function Init() {
    const workspaceId = "cm2el4sot0002nhcysia1pnfu";

    Promise.all([
      getPayrollAction(workspaceId),
      getEmployeesAction(workspaceId),
      getDepartmentsAction(workspaceId),
    ]).then(([payrollData, employees, departmentRes]) => {
      const formattedPayrollData = payrollData.map((entry) => ({
        ...entry,
        employee: {
          ...entry.employee,
          department: entry.employee.department
            ? { id: entry.employee.department, name: entry.employee.department }
            : { id: "", name: "" }, // Handle null or undefined department
        },
      }));
      setEmployeeData(employees.employees);
      setPayrollEntries(formattedPayrollData as PayrollEntryWithEmployee[]);
      setDepartments(departmentRes.departments);
    });
  }

  useEffect(() => {
    Init();
  }, []);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleCreatePayroll = ({
    payPeriod,
    excludedEmployees,
    paymentMethod,
  }: {
    payPeriod: string;
    excludedEmployees: string[];
    paymentMethod: PaymentMode;
  }) => {
    const tid = toast.loading("Creating Payroll...");

    const workspaceId = "cm2el4sot0002nhcysia1pnfu";
    generatePayrollAction(
      workspaceId,
      new Date(payPeriod),
      paymentMethod,
      excludedEmployees
    )
      .then(() => {
        toast.dismiss(tid);
        toast.success("Payroll Created Successfully");
        Init();
      })
      .catch((err) => {
        toast.dismiss(tid);
        toast.error(err.message);
      });

    toast.dismiss(tid);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };

  const filteredPayrollEntries = payrollEntries.filter((entry) => {
    const matchesName =
      entry.employee.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      entry.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMonth = selectedMonth
      ? new Date(entry.paymentDate).getFullYear() ===
          new Date(selectedMonth).getFullYear() &&
        new Date(entry.paymentDate).getMonth() ===
          new Date(selectedMonth).getMonth() &&
        new Date(entry.paymentDate).getDate() ===
          new Date(selectedMonth).getDate()
      : true;

    return matchesName && matchesMonth;
  });

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const totalPayroll = payrollEntries.reduce(
    (sum, entry) => sum + entry.grossSalary,
    0
  );
  const totalDeductions = payrollEntries.reduce(
    (sum, entry) => sum + entry.deductions,
    0
  );
  const totalNetPay = payrollEntries.reduce(
    (sum, entry) => sum + entry.netSalary,
    0
  );

  // useEffect(() => {
  //   const fetchPayrollData = async () => {
  //     try {
  //       const data = await getPayroll("workspaceId"); // Replace with actual workspaceId
  //       setPayrollEntries(data);
  //     } catch (error) {
  //       console.error("Error fetching payroll data:", error);
  //     }
  //   };

  //   fetchPayrollData();
  // }, []);

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
                  <span>
                    {" "}
                    <AttachMoney />{" "}
                  </span>{" "}
                  SLL{" "}
                  {totalPayroll.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
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
                  <AccountBalance /> SLL{" "}
                  {totalDeductions.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
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
                  <Paid />
                  SLL{" "}
                  {totalNetPay.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2, px: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search by Employee Name or Pay Period"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Payroll Period"
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              fullWidth
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
                    {/* <TableCell>Status</TableCell> */}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayrollEntries
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{`${entry.employee.firstName} ${entry.employee.lastName}`}</TableCell>
                        <TableCell>{entry.employeeId}</TableCell>
                        <TableCell>
                          SLL {entry.basicSalary.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {entry.paymentDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell>SLL {entry.deductions.toFixed(2)}</TableCell>
                        <TableCell>SLL {entry.netSalary.toFixed(2)}</TableCell>
                        {/* <TableCell>
                          <Chip
                            label={entry.}
                            color={
                              entry.status === "Paid" ? "success" : "warning"
                            }
                          />
                        </TableCell> */}
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

        <CreatePayrollDialog
          open={openDialog}
          onClose={handleCloseDialog}
          departments={departments}
          employees={employees}
          handleCreatePayroll={handleCreatePayroll}
        />
      </div>
    </LocalizationProvider>
  );
}

interface CreatePayrollDialogProps {
  open: boolean;
  onClose: () => void;
  departments: Department[];
  employees: Employee[];
  handleCreatePayroll: (payrollData: {
    payPeriod: string;
    excludedEmployees: string[];
    paymentMethod: PaymentMode;
  }) => void;
}

const CreatePayrollDialog: React.FC<CreatePayrollDialogProps> = ({
  open,
  onClose,
  departments,
  employees,
  handleCreatePayroll,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMode>(
    PaymentMode.CASH
  );
  const [newPayroll, setNewPayroll] = useState({
    payPeriod: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    }),
    excludedEmployees: [] as string[],
  });

  const filteredEmployees = selectedDepartment
    ? employees.filter(
        (employee) => employee.departmentId === selectedDepartment
      )
    : employees;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Payroll Entry</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Payroll Period"
              type="month"
              value={newPayroll.payPeriod}
              onChange={(e) => {
                setNewPayroll({
                  ...newPayroll,
                  payPeriod: e.target.value,
                });
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMode)}
              fullWidth
            >
              <MenuItem value={PaymentMode.BANK_TRANSFER}>
                Bank Transfer
              </MenuItem>
              <MenuItem value={PaymentMode.CASH}>Cash</MenuItem>
              <MenuItem value={PaymentMode.CHEQUE}>Cheque</MenuItem>
              <MenuItem value={PaymentMode.MOBILE_PAYMENT}>
                Mobile Payment
              </MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={departments}
              size="small"
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Filter by Department" />
              )}
              onChange={(event, newValue) => {
                setSelectedDepartment(newValue ? newValue.id : null);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Select Employees</Typography>
            {filteredEmployees.map((employee) => (
              <div key={employee.id}>
                <Checkbox
                  checked={!newPayroll.excludedEmployees.includes(employee.id)}
                  onChange={(event) => {
                    const newEmployeeIds = event.target.checked
                      ? newPayroll.excludedEmployees.filter(
                          (id) => id !== employee.id
                        )
                      : [...newPayroll.excludedEmployees, employee.id];

                    setNewPayroll({
                      ...newPayroll,
                      excludedEmployees: newEmployeeIds,
                    });
                  }}
                />
                <span>{`${employee.firstName} ${employee.lastName} (ID: ${employee.id})`}</span>
              </div>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleCreatePayroll({
              payPeriod: newPayroll.payPeriod,
              excludedEmployees: newPayroll.excludedEmployees,
              paymentMethod: paymentMethod,
            });
          }}
          variant="contained"
          color="primary"
        >
          Create Payroll
        </Button>
      </DialogActions>
    </Dialog>
  );
};
