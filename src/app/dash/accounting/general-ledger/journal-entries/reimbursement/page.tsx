"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Reimbursement } from "@prisma/client";
import AddReimbursementDialog from "@/components/client-components/core-accounting/reinbursement/add-reimbursement-dialog";
import EditReimbursementDialog from "@/components/client-components/core-accounting/reinbursement/edit-reimbursement-dialog";
import DeleteConfirmationDialog from "@/components/client-components/core-accounting/reinbursement/confirm-delete";

// Mock data for initial display 
const mockReimbursements: Reimbursement[] = [
  {
    id: "1",
    description: "Office Supplies",
    amount: 150.0,
    status: "PENDING",
    createdAt: new Date(),
    account: "General Expenses",
    createdBy: "John Doe",
    updatedAt: new Date(),
    journalEntryId: "1",
    workspaceId: "1",
    userId: "1",
  },
  {
    id: "2",
    description: "Travel Expenses",
    amount: 500.0,
    status: "APPROVED",
    createdAt: new Date(),
    account: "Travel",
    createdBy: "John Doe",
    updatedAt: new Date(),
    journalEntryId: "1",
    workspaceId: "1",
    userId: "1",
  },
  {
    id: "3",
    description: "Client Lunch",
    amount: 75.5,
    status: "REJECTED",
    createdAt: new Date(),
    account: "Meals and Entertainment",
    createdBy: "John Doe",
    updatedAt: new Date(),
    journalEntryId: "1",
    workspaceId: "1",
    userId: "1",
  },
];

export default function ReimbursementsPage() {
  const [reimbursements, setReimbursements] =
    useState<Reimbursement[]>(mockReimbursements);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] =
    useState<Reimbursement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // In a real application, you would fetch reimbursements from an API here
    // For now, we'll use the mock data
  }, []);

  const handleAddReimbursement = (
    newReimbursement: Omit<Reimbursement, "id">
  ) => {
    setReimbursements([
      ...reimbursements,
      { ...newReimbursement, id: reimbursements.length + 1 },
    ]);
    setOpenAddDialog(false);
  };

  const handleEditReimbursement = (updatedReimbursement: Reimbursement) => {
    setReimbursements(
      reimbursements.map((r) =>
        r.id === updatedReimbursement.id ? updatedReimbursement : r
      )
    );
    setOpenEditDialog(false);
    setSelectedReimbursement(null);
  };

  const handleDeleteReimbursement = () => {
    if (selectedReimbursement) {
      setReimbursements(
        reimbursements.filter((r) => r.id !== selectedReimbursement.id)
      );
      setOpenDeleteDialog(false);
      setSelectedReimbursement(null);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredReimbursements = reimbursements.filter(
    (reimbursement) =>
      reimbursement.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reimbursement.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reimbursements
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
        >
          Add New Reimbursement
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReimbursements
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((reimbursement) => (
                <TableRow key={reimbursement.id}>
                  <TableCell>{reimbursement.description}</TableCell>
                  <TableCell align="right">
                    ${reimbursement.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{reimbursement.status}</TableCell>
                  <TableCell>{reimbursement.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>{reimbursement.account}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        setSelectedReimbursement(reimbursement);
                        setOpenEditDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedReimbursement(reimbursement);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon />
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
        count={filteredReimbursements.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AddReimbursementDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddReimbursement}
      />
      <EditReimbursementDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedReimbursement(null);
        }}
        onSubmit={handleEditReimbursement}
        reimbursement={selectedReimbursement}
      />
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedReimbursement(null);
        }}
        onConfirm={handleDeleteReimbursement}
        itemDescription={selectedReimbursement?.description || ""}
      />
    </Box>
  );
}
