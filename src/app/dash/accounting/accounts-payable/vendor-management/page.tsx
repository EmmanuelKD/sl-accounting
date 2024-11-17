"use client";
import {
  createVendorAction,
  getAllVendorsAction,
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
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import {
  AccountsPayable,
  Address,
  Invoice,
  Payment,
  Vendor
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Define types

type VendorExtended = Vendor & {
  Address: Address[];
  accountsPayable: AccountsPayable[];
  invoices: Invoice[];
  payments: Payment[];
};

const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<VendorExtended[]>([]);

  const [filteredVendors, setFilteredVendors] = useState<VendorExtended[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedVendor, setSelectedVendor] = useState<VendorExtended | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<
    Omit<Vendor, "id" | "balance" | "createdAt" | "updatedAt" | "workspaceId">
  >({
    email: "",
    name: "",
    phone: "",
    contactPerson: "",
  });

  async function init() {
    const workspaceId = "cm2el4sot0002nhcysia1pnfu";

    getAllVendorsAction(workspaceId).then((vendors:VendorExtended[]) => {
      setVendors(vendors);
      setFilteredVendors(vendors);
    });
  }
  useEffect(() => {
    init();
  }, []);
  const [activeTab, setActiveTab] = useState<number>(0);

  const itemsPerPage = 10;

  useEffect(() => {
    const filtered = vendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone?.includes(searchTerm)
    );
    setFilteredVendors(filtered);
    setPage(1);
  }, [searchTerm, vendors]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleViewDetails = (vendor: VendorExtended) => {
    setSelectedVendor(vendor);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedVendor(null);
  };
  const handleOpenFormModal = (
    mode: "add" | "edit",
    vendor: Vendor | null = null
  ) => {
    setFormMode(mode);
    if (vendor) {
      const { name, email, phone, contactPerson } = vendor;
      setFormData({ name, email, phone, contactPerson });
    } else {
      setFormData({ name: "", email: "", phone: "", contactPerson: "" });
    }
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setFormData({ name: "", email: "", phone: "", contactPerson: "" });
  };

  const handleFormSubmit = (newVendor: VendorExtended) => {
    if (formMode === "add") {
      setVendors([...vendors, newVendor]);
      toast.success("Vendor added successfully");
    } else {
      const updatedVendors = vendors.map((c) =>
        c.id === selectedVendor?.id ? { ...c, ...formData } : c
      );
      setVendors(updatedVendors);
      toast.success("Vendor updated successfully");
    }
    handleCloseFormModal();
  };

  const handleDeleteVendor = (customerId: string) => {
    const updatedVendors = vendors.filter((c) => c.id !== customerId);
    setVendors(updatedVendors);
    toast.success("Vendor deleted successfully");
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
        Vendor Management
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={8}>
          <TextField
            fullWidth
            label="Search Vendors"
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
            Add New Vendor
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
            {filteredVendors
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((vendor) => {
                return (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>
                      $
                      {vendor.accountsPayable
                        .reduce((acc, curr) => acc + curr.balance, 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewDetails(vendor)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenFormModal("edit", vendor)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteVendor(vendor.id)}>
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
          count={Math.ceil(filteredVendors.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
        />
      </Box>

      {/* Vendor Detail Modal */}
      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        maxWidth="md"
        fullWidth
      >
        {selectedVendor && (
          <>
            <DialogTitle>{selectedVendor.name}</DialogTitle>
            <DialogContent>
              <Typography>
                <strong>Email:</strong> {selectedVendor.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {selectedVendor.phone}
              </Typography>
              <Typography>
                <strong>Balance:</strong> $
                {selectedVendor.accountsPayable
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
                      {selectedVendor.invoices.map((invoice) => (
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
                      {selectedVendor.payments.map((payment) => (
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

      {/* Vendor Form Modal */}
      <Dialog open={isFormModalOpen} onClose={handleCloseFormModal}>
        <DialogTitle>
          {formMode === "add" ? "Add New Vendor" : "Edit Vendor"}
        </DialogTitle>
        <DialogContent>
          <VendorForm handleFormSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default VendorManagement;

function VendorForm({
  handleFormSubmit,
}: {
  handleFormSubmit: (vendor: VendorExtended) => void;
}) {
  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    phone: "",
    contactPerson: "",
    billingAddress: {
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
    if (name in vendor.billingAddress) {
      setVendor({
        ...vendor,
        billingAddress: { ...vendor.billingAddress, [name]: value },
      });
    } else {
      setVendor({ ...vendor, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creating vendor...");
    try {
      const workspaceId = "cm2el4sot0002nhcysia1pnfu";
      const address: Omit<
        Address,
        "createdAt" | "updatedAt" | "id" | "vendorId" | "customerId"
      >[] = [];

      address.push({
        type: "BILLING",
        city: vendor.billingAddress.city,
        country: vendor.billingAddress.country,
        region: vendor.billingAddress.region,
        street: vendor.billingAddress.street,
      });

      const addedVendor = await createVendorAction(
        vendor.name,
        vendor.email,
        vendor.contactPerson,
        workspaceId,
        address,
        vendor.phone
      );
      handleFormSubmit(addedVendor as VendorExtended);
      toast.success("Vendor created successfully");
    } catch (error) {
      toast.error(error as string);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Box
      component="form"
      key="vendors-form"
      onSubmit={handleSubmit}
      sx={{ mt: 2 }}
    >
      <Typography variant="h6">Add New Vendor</Typography>
      <TextField
        label="Vendor Name"
        name="name"
        required
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="Contact Person"
        name="contactPerson"
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

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Add Vendor
      </Button>
    </Box>
  );
}
