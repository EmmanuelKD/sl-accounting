"use client";
import { getAllVendorsMeterdataAction } from "@/lib/actions/core-accounting/customers-vendors-actions";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Autocomplete,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  DepreciationMethod,
  InventoryCategory,
  InventoryItem,
  PaymentMode,
} from "@prisma/client";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { VendorMetadata } from "types";

// Mock data for inventory items
const inventoryData = [
  {
    id: 1,
    name: "Laptop",
    sku: "LT001",
    category: "Electronics",
    quantity: 50,
    lastRestocked: "2023-05-15",
    costPerItem: 800,
    totalValue: 40000,
    depreciationMethod: "Straight-line",
    taxExempt: false,
  },
  {
    id: 2,
    name: "Office Chair",
    sku: "OC001",
    category: "Furniture",
    quantity: 100,
    lastRestocked: "2023-04-20",
    costPerItem: 150,
    totalValue: 15000,
    depreciationMethod: "None",
    taxExempt: true,
  },
  {
    id: 3,
    name: "Printer",
    sku: "PR001",
    category: "Electronics",
    quantity: 20,
    lastRestocked: "2023-05-01",
    costPerItem: 300,
    totalValue: 6000,
    depreciationMethod: "Declining balance",
    taxExempt: false,
  },
  // Add more mock data as needed
];

// Mock data for depreciation chart
const depreciationData = [
  { year: 2023, value: 1000 },
  { year: 2024, value: 900 },
  { year: 2025, value: 810 },
  { year: 2026, value: 729 },
  { year: 2027, value: 656 },
];

const DashboardOverview = () => (
  <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1">Total Inventory Value</Typography>
        <Typography variant="h4">$61,000</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1">Low-Stock Alerts</Typography>
        <Typography variant="h4">3</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1">Most Recent Update</Typography>
        <Typography variant="h6">2023-05-15</Typography>
      </Grid>
    </Grid>
  </Paper>
);

const AddInventoryItemForm = ({
  open,
  handleClose,
  handleSave,
}: {
  open: boolean;
  handleClose: () => void;
  handleSave: (
    data: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
  ) => void;
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name === "isCredit") {
      setInventoryItem((prev) => ({
        ...prev,
        isCredit: value === "true",
      }));
    } else {
      setInventoryItem((prev) => ({
        ...prev,
        [name as keyof InventoryItem]: value,
      }));
    }
  };

  // Example submit function (for demonstration)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inventory Item:", inventoryItem);
    // Here, you would send `inventoryItem` to the backend or use it in other logic
  };

  // createInventoryItemAction
  // Initialize the form state
  const [inventoryItem, setInventoryItem] = useState<
    Omit<
      InventoryItem,
      "id" | "imgUrl" | "createdAt" | "updatedAt" | "accountId" | "workspaceId"
    > & {
      isCredit: boolean;
      vendor: VendorMetadata | null;
     }
  >({
    name: "",
    sku: "",
    description: "",
    quantity: 0,
    reorderLevel: 0,
    unitCost: 0,
    categoryId: 0,
    salvageValue: 0,
    dateOfPurchase: new Date(),
    expirationDate: new Date(),
    quantityInStock: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    supplierName: "",
    supplierContact: "",
    inventoryAccount: "",
    usefulLife: 0,
    location: "",
    depreciationMethod: "DECLINING_BALANCE",
    notes: "",
    isCredit: false,
    vendor: null,
    paymentMode: "CASH",
    category: InventoryCategory.FINISHED_GOODS,
  });

  const workspaceId = "cm2el4sot0002nhcysia1pnfu";


  const [vendors, setVendors] = useState<VendorMetadata[]>([]);

  useEffect(() => {
    getAllVendorsMeterdataAction(workspaceId).then((vendors) => {
      vendors.push({
        id: "NO_ID_EXTERNAL",
        name: "External",
        email: "",
        phone: "",
      });
      setVendors(vendors as VendorMetadata[]);
    });
  }, []);
  useEffect(() => {
    console.log(inventoryItem);
  }, [inventoryItem]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Inventory Item</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Basic Item Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item Name"
                name="name"
                fullWidth
                required
                value={inventoryItem.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="SKU"
                name="sku"
                fullWidth
                value={inventoryItem.sku}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={Object.values(InventoryCategory)}
                getOptionLabel={(option) => option.replace(/_/g, " ")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    variant="outlined"
                    fullWidth
                  />
                )}
                value={inventoryItem.category}
                onChange={(event, newValue) => {
                  setInventoryItem((prev) => ({
                    ...prev,
                    category: newValue || "",
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={3}
                value={inventoryItem.description}
                onChange={handleChange}
              />
            </Grid>

            {/* Quantity & Pricing */}
            <Grid item xs={6}>
              <TextField
                label="Quantity in Stock"
                name="quantityInStock"
                type="number"
                fullWidth
                required
                value={inventoryItem.quantityInStock}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Reorder Level"
                name="reorderLevel"
                type="number"
                fullWidth
                value={inventoryItem.reorderLevel}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Purchase/Unit Price"
                name="purchasePrice"
                type="number"
                fullWidth
                required
                value={inventoryItem.purchasePrice}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Selling Price"
                name="sellingPrice"
                type="number"
                fullWidth
                required
                value={inventoryItem.sellingPrice}
                onChange={handleChange}
              />
            </Grid>

            {/* Credit-related Fields */}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Is Credit Purchase?</InputLabel>
                <Select
                  name="isCredit"
                  value={inventoryItem.isCredit}
                  onChange={handleChange}
                >
                  <MenuItem value={"false"}>No</MenuItem>
                  <MenuItem value={"true"}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!inventoryItem.isCredit && (
              <Grid item xs={6}>
               <FormControl fullWidth>
                <InputLabel>Paying through</InputLabel>
                <Select
                  name="paymentMode"
                  value={inventoryItem.paymentMode}
                  onChange={handleChange}
                >
                  <MenuItem value={PaymentMode.CASH}>
                   Cash
                  </MenuItem>
                  <MenuItem value={PaymentMode.BANK_TRANSFER}>
                    Bank
                  </MenuItem>
                  <MenuItem value={PaymentMode.CHEQUE}>
                   Cheque
                  </MenuItem>
                  <MenuItem value={PaymentMode.MOBILE_PAYMENT}>
                    Mobile Payment
                  </MenuItem>
                  
                </Select>
              </FormControl>
              </Grid>
            )}
            {/* Vendor Details (only visible if on credit) */}

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={vendors.filter((v) => !(inventoryItem.isCredit && v.id === "NO_ID_EXTERNAL"))}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Vendor" fullWidth required />
                )}
                value={
                  vendors.find(
                    (option) => option.id === inventoryItem.vendor?.id
                  ) || null
                }
                renderOption={(props, option) => (
                  <li {...props}>
                    <Typography
                      sx={{
                        color: option.id === "NO_ID_EXTERNAL" ? "red" : "inherit"
                      }}
                    >
                      {option.name}
                    </Typography>
                  </li>
                )}
                onChange={(event, newValue) => {
                  setInventoryItem((prev) => ({
                    ...prev,
                    vendor: newValue ? newValue : null,
                  }));
                }}
              />
            </Grid>

           

            {!inventoryItem.isCredit &&
              inventoryItem.vendor?.id === "NO_ID_EXTERNAL" && (
                <>
                  {/* Supplier Details */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Supplier Name"
                      name="supplierName"
                      fullWidth
                      value={inventoryItem.supplierName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Supplier Contact"
                      name="supplierContact"
                      fullWidth
                      value={inventoryItem.supplierContact}
                      onChange={handleChange}
                    />
                  </Grid>
                </>
              )}
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Depreciation Method</InputLabel>
                <Select
                  name="depreciationMethod"
                  value={inventoryItem.depreciationMethod}
                  onChange={handleChange}
                >
                  <MenuItem value={DepreciationMethod.STRAIGHT_LINE}>
                    Straight-Line
                  </MenuItem>
                  <MenuItem value={DepreciationMethod.DECLINING_BALANCE}>
                    Declining Balance
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Salvage Value"
                name="salvageValue"
                type="number"
                fullWidth
                value={inventoryItem.salvageValue}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Useful Life (Years)"
                name="usefulLife"
                type="number"
                fullWidth
                value={inventoryItem.usefulLife}
                onChange={handleChange}
              />
            </Grid>

            {/* Additional Metadata */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                fullWidth
                value={inventoryItem.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date of Purchase"
                name="dateOfPurchase"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={inventoryItem.dateOfPurchase}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Expiration Date"
                name="expirationDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={inventoryItem.expirationDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                fullWidth
                multiline
                rows={3}
                value={inventoryItem.notes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="upload-button"
              />
              <label htmlFor="upload-button">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
              {imagePreview && (
                <Box mt={2}>
                  <Image
                    width={200}
                    height={200}
                    src={imagePreview}
                    alt="Selected"
                  />
                </Box>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
              >
                Add Inventory Item
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Add Item
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

const InventoryTable = () => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Item Name", flex: 1 },
    { field: "sku", headerName: "SKU", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "quantity", headerName: "Quantity", type: "number", flex: 1 },
    { field: "lastRestocked", headerName: "Last Restocked", flex: 1 },
    {
      field: "costPerItem",
      headerName: "Cost per Item",
      type: "number",
      flex: 1,
    },
    { field: "totalValue", headerName: "Total Value", type: "number", flex: 1 },
    { field: "depreciationMethod", headerName: "Depreciation Method", flex: 1 },
    { field: "taxExempt", headerName: "Tax Exempt", type: "boolean", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => console.log("Edit", params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => console.log("Delete", params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => console.log("Restock", params.row.id)}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={inventoryData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

const LowStockAlerts = () => (
  <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
    <Typography variant="h6" gutterBottom>
      Low-Stock Alerts
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Item Name</TableCell>
          <TableCell>Current Quantity</TableCell>
          <TableCell>Reorder Point</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Printer</TableCell>
          <TableCell>5</TableCell>
          <TableCell>10</TableCell>
          <TableCell>
            <Button variant="contained" size="small">
              Reorder
            </Button>
          </TableCell>
        </TableRow>
        {/* Add more low-stock items as needed */}
      </TableBody>
    </Table>
  </Paper>
);

const FiltersAndSearch = () => (
  <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Furniture">Furniture</MenuItem>
            <MenuItem value="Office Supplies">Office Supplies</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
          <InputLabel>Supplier</InputLabel>
          <Select>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Supplier A">Supplier A</MenuItem>
            <MenuItem value="Supplier B">Supplier B</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Date Added"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Search"
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Grid>
    </Grid>
  </Paper>
);

const DetailedView = ({
  open,
  handleClose,
  item,
}: {
  open: boolean;
  handleClose: () => void;
  item: any;
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: "50%" } }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {item?.name}
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Details" />
          <Tab label="History" />
          <Tab label="Depreciation" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1">SKU: {item?.sku}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Category: {item?.category}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Quantity: {item?.quantity}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Cost per Item: ${item?.costPerItem}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Total Value: ${item?.totalValue}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Depreciation Method: {item?.depreciationMethod}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Tax Exempt: {item?.taxExempt ? "Yes" : "No"}
                </Typography>
              </Grid>
            </Grid>
          )}
          {tabValue === 1 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Quantity Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>2023-05-15</TableCell>
                  <TableCell>Restocked</TableCell>
                  <TableCell>+20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-04-01</TableCell>
                  <TableCell>Sold</TableCell>
                  <TableCell>-5</TableCell>
                </TableRow>
                {/* Add more history rows as needed */}
              </TableBody>
            </Table>
          )}
          {tabValue === 2 && (
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={depreciationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default function InventoryManagement() {
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [detailedViewOpen, setDetailedViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddItemClick = () => {
    setAddItemDialogOpen(true);
  };

  const handleAddItemClose = () => {
    setAddItemDialogOpen(false);
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setDetailedViewOpen(true);
  };

  const handleDetailedViewClose = () => {
    setDetailedViewOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>
      <DashboardOverview />
      <FiltersAndSearch />
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddItemClick}
        >
          Add New Item
        </Button>
      </Box>
      <InventoryTable />
      <LowStockAlerts />
      <AddInventoryItemForm
        open={addItemDialogOpen}
        handleClose={handleAddItemClose}
        // handleSave={handleAddItemSave}
      />
      <DetailedView
        open={detailedViewOpen}
        handleClose={handleDetailedViewClose}
        item={selectedItem}
      />
    </Box>
  );
}
