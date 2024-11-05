"use client";
// import { getAccounts } from "@/app/dash/accounting/general-ledger/chart-of-accounts/page";
import AccountModal from "@/components/client-components/core-accounting/account-model";
import { ERROR_MESSAGE } from "@/const";
import {
  createAccountAction,
  deleteAccountAction,
  getAccountsAction,
  updateAccountAction,
} from "@/lib/actions/core-accounting/account-actions";
import { HttpError } from "@/utils/errorHandler";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import toast from "react-hot-toast";
import { AccountMinimal } from "types";

//@todo change ths table to expandable data grid like a treeview groupting 
//all data can be expanded base on their children
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

  const handleDeleteAccount = async (accountId: string) => {
    const key = toast.loading(`Deleting account...`);
    try {
      const result = await deleteAccountAction(accountId);
      if (result.account)
        setAccounts(accounts.filter((account) => account.id !== accountId));
      toast.success(`Account deleted successfully`, { id: key });
    } catch (error) {
      if (error instanceof HttpError) {
        toast.error(`${error.message}`, { id: key });
      } else {
        console.error(error);
        toast.error(ERROR_MESSAGE, { id: key });
      }
    }
  };
  const reloadAccounts = async () => {
    const reloadedAccounts = await getAccountsAction();
    setAccounts(reloadedAccounts.accounts);
  };

  const handleSaveAccount = (account: AccountMinimal) => {
    if (editingAccount) {
      updateAccountAction(account.id, {
        name: account.name,
        number: account.number,
        balance: account.balance,
        type: account.type,
        parentAccountId: account.parentAccountId ?? undefined,
        workspaceId: account.workspaceId,
      }).then(() => reloadAccounts());
      setAccounts(accounts.map((a) => (a.id === account.id ? account : a)));
    } else {
      createAccountAction({
        name: account.name,
        number: account.number,
        balance: account.balance,
        type: account.type,
        parentAccountId: account.parentAccountId ?? undefined,
        workspaceId: account.workspaceId,
      }).then(() => reloadAccounts());
      setAccounts([...accounts, { ...account, id: "" }]);
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
    {
      field: "balance",
      headerName: "Account Balance",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>{`SLL ${params.value}`}</Typography>
        </Box>
      ),
    },
    { field: "type", headerName: "Account Type", flex: 1 },
    {
      field: "parentAccount",
      headerName: "Parent Account",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>{`${
            params.value ?? "NA"
          }`}</Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            disabled={params.row.id === ""}
            startIcon={<EditIcon />}
            onClick={() => handleEditAccount(params.row)}
          >
            Edit
          </Button>
          <Button
            disabled={params.row.id === ""}
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
              rows={filteredAccounts.map((account) => ({
                ...account,
                parentAccount: account.parentAccountId
                  ? accounts.find((a) => a.id === account.parentAccountId)
                      ?.name ?? "NA"
                  : "NA",
              }))}
              columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              checkboxSelection
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
