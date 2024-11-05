"use client";
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Tabs,
  Tab,
  Box,
  Pagination,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'

// Define types
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
}

interface Invoice {
  id: number;
  customerId: number;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  dueDate: string;
}

interface Payment {
  id: number;
  customerId: number;
  amount: number;
  date: string;
  method: string;
}

// Mock data
const mockCustomers: Customer[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', balance: 1000 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', balance: 1500 },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', phone: '456-789-0123', balance: 750 },
  { id: 4, name: 'Bob Williams', email: 'bob@example.com', phone: '789-012-3456', balance: 2000 },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '234-567-8901', balance: 500 },
]

const mockInvoices: Invoice[] = [
  { id: 1, customerId: 1, totalAmount: 500, status: 'PENDING', dueDate: '2024-11-01' },
  { id: 2, customerId: 1, totalAmount: 750, status: 'PAID', dueDate: '2024-10-15' },
  { id: 3, customerId: 2, totalAmount: 1000, status: 'OVERDUE', dueDate: '2024-09-30' },
  { id: 4, customerId: 2, totalAmount: 500, status: 'PENDING', dueDate: '2024-11-15' },
  { id: 5, customerId: 3, totalAmount: 250, status: 'PAID', dueDate: '2024-10-01' },
  { id: 6, customerId: 3, totalAmount: 500, status: 'PENDING', dueDate: '2024-11-30' },
  { id: 7, customerId: 4, totalAmount: 1500, status: 'OVERDUE', dueDate: '2024-09-15' },
  { id: 8, customerId: 4, totalAmount: 500, status: 'PENDING', dueDate: '2024-12-01' },
  { id: 9, customerId: 5, totalAmount: 250, status: 'PAID', dueDate: '2024-10-30' },
  { id: 10, customerId: 5, totalAmount: 250, status: 'PENDING', dueDate: '2024-11-30' },
]

const mockPayments: Payment[] = [
  { id: 1, customerId: 1, amount: 250, date: '2024-10-10', method: 'Credit Card' },
  { id: 2, customerId: 2, amount: 500, date: '2024-10-05', method: 'Bank Transfer' },
  { id: 3, customerId: 3, amount: 250, date: '2024-09-30', method: 'PayPal' },
  { id: 4, customerId: 4, amount: 1000, date: '2024-09-25', method: 'Credit Card' },
  { id: 5, customerId: 5, amount: 250, date: '2024-10-20', method: 'Bank Transfer' },
]

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false)
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add')
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'balance'>>({ name: '', email: '', phone: '' })
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' })
  const [activeTab, setActiveTab] = useState<number>(0)

  const itemsPerPage = 10

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    )
    setFilteredCustomers(filtered)
    setPage(1)
  }, [searchTerm, customers])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedCustomer(null)
  }

  const handleOpenFormModal = (mode: 'add' | 'edit', customer: Customer | null = null) => {
    setFormMode(mode)
    if (customer) {
      const { name, email, phone } = customer
      setFormData({ name, email, phone })
    } else {
      setFormData({ name: '', email: '', phone: '' })
    }
    setIsFormModalOpen(true)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setFormData({ name: '', email: '', phone: '' })
  }

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleFormSubmit = () => {
    if (formMode === 'add') {
      const newCustomer: Customer = { ...formData, id: customers.length + 1, balance: 0 }
      setCustomers([...customers, newCustomer])
      setSnackbar({ open: true, message: 'Customer added successfully', severity: 'success' })
    } else {
      const updatedCustomers = customers.map((c) => (c.id === selectedCustomer?.id ? { ...c, ...formData } : c))
      setCustomers(updatedCustomers)
      setSnackbar({ open: true, message: 'Customer updated successfully', severity: 'success' })
    }
    handleCloseFormModal()
  }

  const handleDeleteCustomer = (customerId: number) => {
    const updatedCustomers = customers.filter((c) => c.id !== customerId)
    setCustomers(updatedCustomers)
    setSnackbar({ open: true, message: 'Customer deleted successfully', severity: 'success' })
  }

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar({ ...snackbar, open: false })
  }

  const TabPanel: React.FC<{ children?: React.ReactNode; value: number; index: number }> = (props) => {
    const { children, value, index, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    )
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Customer Management
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={8}>
          <TextField
            fullWidth
            label="Search Customers"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenFormModal('add')}
          >
            Add New Customer
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>${customer.balance.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewDetails(customer)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenFormModal('edit', customer)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteCustomer(customer.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredCustomers.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
        />
      </Box>

      {/* Customer Detail Modal */}
      <Dialog open={isDetailModalOpen} onClose={handleCloseDetailModal} maxWidth="md" fullWidth>
        {selectedCustomer && (
          <>
            <DialogTitle>{selectedCustomer.name}</DialogTitle>
            <DialogContent>
              <Typography><strong>Email:</strong> {selectedCustomer.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedCustomer.phone}</Typography>
              <Typography><strong>Balance:</strong> ${selectedCustomer.balance.toFixed(2)}</Typography>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  <Tab label="Invoices" value={0} />
                  <Tab label="Payments" value={1} />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Due Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockInvoices
                        .filter((invoice) => invoice.customerId === selectedCustomer.id)
                        .map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{invoice.status}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Method</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockPayments
                        .filter((payment) => payment.customerId === selectedCustomer.id)
                        .map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailModal}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Customer Form Modal */}
      <Dialog open={isFormModalOpen} onClose={handleCloseFormModal}>
        <DialogTitle>{formMode === 'add' ? 'Add New Customer' : 'Edit Customer'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleFormChange}
          />
          <TextField
            
            margin="dense"
            name="phone"
            label="Phone"
            type="tel"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormModal}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            {formMode === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default CustomerManagement