"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { Invoice, markInvoiceAsPaid } from "./to-delete";
import Link from "next/link";
import { paths } from "@/paths";

interface AccountsPayableContentProps {
  initialInvoices: Invoice[];
  totalPayable: number;
  overduePayable: number;
}

export default function AccountsPayableContent({
  initialInvoices,
  totalPayable,
  overduePayable,
}: AccountsPayableContentProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Invoice>("dueDate");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [markAsPaidInvoice, setMarkAsPaidInvoice] = useState<Invoice | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property: keyof Invoice) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewInvoice(invoice);
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    setMarkAsPaidInvoice(invoice);
  };

  const confirmMarkAsPaid = async () => {
    if (markAsPaidInvoice) {
      setLoading(true);
      try {
        await markInvoiceAsPaid(markAsPaidInvoice.id);
        const updatedInvoices = invoices.map((inv) =>
          inv.id === markAsPaidInvoice.id
            ? { ...inv, status: "Paid" as const }
            : inv
        );
        setInvoices(updatedInvoices);
        setMarkAsPaidInvoice(null);
      } catch (err: any) {
        setError("Failed to mark invoice as paid. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const sortedInvoices = invoices.sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return b[orderBy] < a[orderBy] ? -1 : 1;
    }
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Accounts Payable
            </Typography>
            <Button
              color="inherit"
              LinkComponent={Link}
              href={
                paths.dashboard.accounting.accounts_receivable.customer_profiles
              }
            >
              Vendors
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Payable
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <AccountBalanceIcon sx={{ mr: 1 }} />$
                {totalPayable.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Overdue Payables
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{ display: "flex", alignItems: "center" }}
                color="error"
              >
                <ErrorIcon sx={{ mr: 1 }} />${overduePayable.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "id"}
                        direction={orderBy === "id" ? order : "asc"}
                        onClick={() => handleSort("id")}
                      >
                        Invoice ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "vendorName"}
                        direction={orderBy === "vendorName" ? order : "asc"}
                        onClick={() => handleSort("vendorName")}
                      >
                        Vendor Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "invoiceDate"}
                        direction={orderBy === "invoiceDate" ? order : "asc"}
                        onClick={() => handleSort("invoiceDate")}
                      >
                        Invoice Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "dueDate"}
                        direction={orderBy === "dueDate" ? order : "asc"}
                        onClick={() => handleSort("dueDate")}
                      >
                        Due Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "totalAmount"}
                        direction={orderBy === "totalAmount" ? order : "asc"}
                        onClick={() => handleSort("totalAmount")}
                      >
                        Total Amount
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "status"}
                        direction={orderBy === "status" ? order : "asc"}
                        onClick={() => handleSort("status")}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedInvoices
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.vendorName}</TableCell>
                        <TableCell>
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          ${invoice.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Typography
                            color={
                              invoice.status === "Paid"
                                ? "success.main"
                                : invoice.status === "Overdue"
                                ? "error.main"
                                : "warning.main"
                            }
                          >
                            {invoice.status}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleViewInvoice(invoice)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {invoice.status !== "Paid" && (
                            <IconButton
                              onClick={() => handleMarkAsPaid(invoice)}
                              color="success"
                            >
                              <CheckIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={invoices.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* View Invoice Dialog */}
      <Dialog
        open={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Invoice Details</DialogTitle>
        <DialogContent>
          {viewInvoice && (
            <>
              <Typography>
                <strong>Invoice ID:</strong> {viewInvoice.id}
              </Typography>
              <Typography>
                <strong>Vendor:</strong> {viewInvoice.vendorName}
              </Typography>
              <Typography>
                <strong>Invoice Date:</strong>{" "}
                {new Date(viewInvoice.invoiceDate).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Due Date:</strong>{" "}
                {new Date(viewInvoice.dueDate).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Total Amount:</strong> $
                {viewInvoice.totalAmount.toLocaleString()}
              </Typography>
              <Typography>
                <strong>Status:</strong> {viewInvoice.status}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewInvoice(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Mark as Paid Confirmation Dialog */}
      <Dialog
        open={!!markAsPaidInvoice}
        onClose={() => setMarkAsPaidInvoice(null)}
      >
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark Invoice #{markAsPaidInvoice?.id} as
            paid?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMarkAsPaidInvoice(null)}>Cancel</Button>
          <Button
            onClick={confirmMarkAsPaid}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
}
