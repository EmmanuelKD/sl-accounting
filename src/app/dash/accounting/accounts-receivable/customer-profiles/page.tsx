"use client";
import {
  createCustomerAction,
  getAllCustomersAction,
} from "@/lib/actions/core-accounting/customers-vendors-actions";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Pagination,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { AccountsReceivable, Address, Customer, Invoice, Payment } from "@prisma/client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as uuid from "uuid";
// Define types

type CustomerExtended = Customer & {
  Address: Address[];
  accountsReceivable: AccountsReceivable[];
  invoices: Invoice[];
  payments: Payment[];
};

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerExtended[]>([]);

  const [filteredCustomers, setFilteredCustomers] = useState<
    CustomerExtended[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerExtended | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<
    Omit<Customer, "id" | "balance" | "createdAt" | "updatedAt" | "workspaceId">
  >({
    email: "",
    name: "",
    phone: "",
  });

  async function init() {
    const workspaceId = "cm2el4sot0002nhcysia1pnfu";

    getAllCustomersAction(workspaceId).then((customers) => {
      setCustomers(customers);
      setFilteredCustomers(customers);
    });
  }
  useEffect(() => {
    init();
  }, []);
  const [activeTab, setActiveTab] = useState<number>(0);

  const itemsPerPage = 10;

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
    setPage(1);
  }, [searchTerm, customers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleViewDetails = (customer: CustomerExtended) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCustomer(null);
  };
  const handleOpenFormModal = (
    mode: "add" | "edit",
    customer: Customer | null = null
  ) => {
    setFormMode(mode);
    if (customer) {
      const { name, email, phone } = customer;
      setFormData({ name, email, phone });
    } else {
      setFormData({ name: "", email: "", phone: "" });
    }
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setFormData({ name: "", email: "", phone: "" });
  };

  const handleFormSubmit = (newCustomer: CustomerExtended) => {
    if (formMode === "add") {
      setCustomers([...customers, newCustomer]);
      toast.success("Customer added successfully");
    } else {
      const updatedCustomers = customers.map((c) =>
        c.id === selectedCustomer?.id ? { ...c, ...formData } : c
      );
      setCustomers(updatedCustomers);
      toast.success("Customer updated successfully");
    }
    handleCloseFormModal();
  };

  const handleDeleteCustomer = (customerId: string) => {
    const updatedCustomers = customers.filter((c) => c.id !== customerId);
    setCustomers(updatedCustomers);
    toast.success("Customer deleted successfully");
  };

  const TabPanel: React.FC<{
    children?: React.ReactNode;
    value: number;
    index: number;
  }> = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

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
            onClick={() => handleOpenFormModal("add")}
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
              .map((customer) => {
                return (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      $
                      {customer.accountsReceivable
                        .reduce((acc, curr) => acc + curr.balance, 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewDetails(customer)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenFormModal("edit", customer)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredCustomers.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
        />
      </Box>

      {/* Customer Detail Modal */}
      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        maxWidth="md"
        fullWidth
      >
        {selectedCustomer && (
          <>
            <DialogTitle>{selectedCustomer.name}</DialogTitle>
            <DialogContent>
              <Typography>
                <strong>Email:</strong> {selectedCustomer.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {selectedCustomer.phone}
              </Typography>
              <Typography>
                <strong>Balance:</strong> $
                {selectedCustomer.accountsReceivable
                  .reduce((acc, curr) => acc + curr.balance, 0)
                  .toFixed(2)}
              </Typography>

              <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                >
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
                      {selectedCustomer.invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            ${invoice.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>{invoice.status}</TableCell>
                          <TableCell>
                            {invoice.dueDate.toLocaleDateString()}
                          </TableCell>
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
                      {selectedCustomer.payments
                        .map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              {payment.date.toLocaleDateString()}
                            </TableCell>
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
        <DialogTitle>
          {formMode === "add" ? "Add New Customer" : "Edit Customer"}
        </DialogTitle>
        <DialogContent>
          <CustomerForm handleFormSubmit={handleFormSubmit} />
        </DialogContent> 
      </Dialog> 
    </Container>
  );
};

export default CustomerManagement;

function CustomerForm({
  handleFormSubmit,
}: {
  handleFormSubmit: (customer: CustomerExtended) => void;
}) {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    billingAddress: {
      street: "",
      city: "",
      region: "",
      // zipCode: '',
      country: "",
    },
    shippingAddress: {
      street: "",
      city: "",
      region: "",
      // zipCode: '',
      country: "",
    },
    sameAsBilling: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in customer.billingAddress) {
      setCustomer({
        ...customer,
        billingAddress: { ...customer.billingAddress, [name]: value },
      });
      if (customer.sameAsBilling) {
        setCustomer({
          ...customer,
          shippingAddress: { ...customer.shippingAddress, [name]: value },
        });
      }
    } else if (name in customer.shippingAddress) {
      setCustomer({
        ...customer,
        shippingAddress: { ...customer.shippingAddress, [name]: value },
      });
    } else {
      setCustomer({ ...customer, [name]: value });
    }
  };

  const handleCheckboxChange = () => {
    setCustomer({
      ...customer,
      sameAsBilling: !customer.sameAsBilling,
      shippingAddress: customer.sameAsBilling
        ? customer.billingAddress
        : customer.shippingAddress,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creating customer...");
    try {
      const workspaceId = "cm2el4sot0002nhcysia1pnfu";
      const customerId = uuid.v4();
      const address: Omit<
        Address,
        "createdAt" | "updatedAt" | "id" | "customerId"
      >[] = [];
      if (customer.sameAsBilling) {
        address.push(
          {
            // customerId,
            type: "BILLING",
            city: customer.billingAddress.city,
            country: customer.billingAddress.country,
            region: customer.billingAddress.region,
            street: customer.billingAddress.street,
            vendorId: null,
          },
          {
            // customerId,
            type: "SHIPPING",
            city: customer.billingAddress.city,
            country: customer.billingAddress.country,
            region: customer.billingAddress.region,
            street: customer.billingAddress.street,
            vendorId: null,
          }
        );
      } else {
        address.push(
          {
            // customerId,
            type: "BILLING",
            city: customer.billingAddress.city,
            country: customer.billingAddress.country,
            region: customer.billingAddress.region,
            street: customer.billingAddress.street,
            vendorId: null,
          },
          {
            // customerId,
            type: "SHIPPING",
            city: customer.shippingAddress.city,
            country: customer.shippingAddress.country,
            region: customer.shippingAddress.region,
            street: customer.shippingAddress.street,
            vendorId: null,
          }
        );
      }

      const addedCustomer = await createCustomerAction(
        customerId,
        customer.name,
        customer.email,
        workspaceId,
        address,
        customer.phone
      );
      handleFormSubmit(addedCustomer as CustomerExtended);
      toast.success("Customer created successfully");
    } catch (error) {
      toast.error(error as string);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Box
      component="form"
      key="customers-form"
      onSubmit={handleSubmit}
      sx={{ mt: 2 }}
    >
      <Typography variant="h6">Add New Customer</Typography>
      <TextField
        label="Customer Name"
        name="name"
        required
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        required
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="Phone"
        name="phone"
        required
        fullWidth
        margin="normal"
        onChange={handleChange}
      />

      <Typography variant="subtitle1" mt={2}>
        Billing Address
      </Typography>
      <TextField
        label="Street"
        name="street"
        required
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="City"
        name="city"
        required
        fullWidth
        margin="normal"
        onChange={handleChange}
      />

      <TextField
        label="Country"
        name="country"
        required
        fullWidth
        margin="normal"
        onChange={handleChange}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={customer.sameAsBilling}
            onChange={handleCheckboxChange}
          />
        }
        label="Shipping address same as billing"
      />

      {!customer.sameAsBilling && (
        <>
          <Typography variant="subtitle1" mt={2}>
            Shipping Address
          </Typography>
          <TextField
            label="Street"
            name="street"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="City"
            name="city"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Region"
            name="region"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          {/* <TextField label="Zip Code" name="zipCode" fullWidth margin="normal" onChange={handleChange} /> */}
          <TextField
            label="Country"
            name="country"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
        </>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Add Customer
      </Button>
    </Box>
  );
}
