"use client"
import { paths } from '@/paths'
import {
  GetApp as GetAppIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material'
import {
  Alert,
  AppBar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Link from 'next/link'
import { useState } from 'react'

// Mock data
const mockTransactions = [
  {
    id: '1',
    customerId: '101',
    customer: {
      id: '101',
      name: 'John Doe',
      email: 'john@example.com',
    },
    amount: 500.0,
    status: 'PENDING',
    dueDate: '2024-10-25',
    createdAt: '2024-09-01',
    updatedAt: '2024-09-15',
  },
  {
    id: '2',
    customerId: '102',
    customer: {
      id: '102',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    amount: 300.0,
    status: 'OVERDUE',
    dueDate: '2024-09-15',
    createdAt: '2024-08-15',
    updatedAt: '2024-08-20',
  },
  // Add more mock transactions...
]

export default function AccountsReceivable() {
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [search, setSearch] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

 

  const handleMenuOpen = (event: any, transaction: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedTransaction(transaction)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTransaction(null)
  }

  const handleActionConfirm = (action: string) => {
    setDialogOpen(false)
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSnackbarOpen(true)
    }, 1000)
  }

  const filteredTransactions = mockTransactions.filter((transaction) => {
    return (
      (!status || transaction.status === status) &&
      (!search ||
        transaction.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        transaction.customer.email.toLowerCase().includes(search.toLowerCase()) ||
        transaction.id.toLowerCase().includes(search.toLowerCase()))
    )
  })

  const totalOutstanding = filteredTransactions
    .filter((t) => t.status === 'PENDING' || t.status === 'OVERDUE')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingCount = filteredTransactions.filter((t) => t.status === 'PENDING').length
  const overdueCount = filteredTransactions.filter((t) => t.status === 'OVERDUE').length

  return (
    <div>
     <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h4" style={{ flexGrow: 1 }}>
              Accounts Receivable
            </Typography>
             
            <Button
              color="inherit"
              LinkComponent={Link}
              href={paths.dashboard.accounting.accounts_receivable.customer_profiles}
            >
              Customers
            </Button>
          </Toolbar>
        </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Filters
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="PAID">Paid</MenuItem>
                      <MenuItem value="OVERDUE">Overdue</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Outstanding
                </Typography>
                <Typography variant="h4">${totalOutstanding.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending Transactions
                </Typography>
                <Typography variant="h4">{pendingCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overdue Transactions
                </Typography>
                <Typography variant="h4">{overdueCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  AR Transactions
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<GetAppIcon />}
                  sx={{ mb: 2 }}
                  onClick={() => {
                    // Implement CSV export logic here
                  }}
                >
                  Export to CSV
                </Button>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.customer.name}</TableCell>
                          <TableCell>{transaction.customer.email}</TableCell>
                          <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Typography
                              color={
                                transaction.status === 'PAID'
                                  ? 'success.main'
                                  : transaction.status === 'OVERDUE'
                                  ? 'error.main'
                                  : 'warning.main'
                              }
                            >
                              {transaction.status}
                            </Typography>
                          </TableCell>
                          <TableCell>{transaction.dueDate}</TableCell>
                          <TableCell>{transaction.createdAt}</TableCell>
                          <TableCell>
                            <IconButton onClick={(e) => handleMenuOpen(e, transaction)}>
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedTransaction && selectedTransaction.status !== 'PAID' && (
          <MenuItem onClick={() => setDialogOpen(true)}>Mark as Paid</MenuItem>
        )}
        {selectedTransaction && selectedTransaction.status === 'OVERDUE' && (
          <MenuItem onClick={() => setDialogOpen(true)}>Send Reminder</MenuItem>
        )}
      </Menu>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to perform this action?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleActionConfirm()} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Action completed successfully!
        </Alert>
      </Snackbar>

      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  )
}