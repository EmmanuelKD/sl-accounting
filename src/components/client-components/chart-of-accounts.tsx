"use client";
import AccountModal from "@/components/account-model";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { AccountMinimal } from "types";

export default function ChartOfAccounts({
  initialAccounts,
}: {
  initialAccounts: AccountMinimal[];
}) {
  const [accounts, setAccounts] = useState<AccountMinimal[]>(initialAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountMinimal | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleEditAccount = (account: AccountMinimal) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    // Implement delete logic here
    setAccounts(accounts.filter((account) => account.id !== accountId));
  };

  const handleSaveAccount = (account: AccountMinimal) => {
    if (editingAccount) {
      setAccounts(accounts.map((a) => (a.id === account.id ? account : a)));
    } else {
      setAccounts([...accounts, { ...account, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: "number", headerName: "Account Number", flex: 1 },
    { field: "name", headerName: "Account Name", flex: 2 },
    { field: "type", headerName: "Account Type", flex: 1 },
    { field: "parentAccount", headerName: "Parent Account", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            startIcon={<EditIcon />}
            onClick={() => handleEditAccount(params.row)}
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteAccount(params.row.id)}
            color="error"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Chart of Accounts
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddAccount}
          >
            Add New Account
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search accounts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredAccounts}
              columns={columns}
              //   rows={filteredAccounts}
              //   columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              //   checkboxSelection
              //   pageSize={5}
              //   rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              //   disableSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>
      <AccountModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAccount}
        account={editingAccount}
        accounts={accounts}
      />
    </Container>
  );
}
