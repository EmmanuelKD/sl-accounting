"use client";
import AccountModal from "@/components/client-components/core-accounting/account-model";
import { ERROR_MESSAGE } from "@/const";
import {
  changeAccountParentAction,
  createAccountAction,
  deleteAccountAction,
  getAccountsAction,
  updateAccountAction,
} from "@/lib/actions/core-accounting/account-actions";
import { HttpError } from "@/utils/errorHandler";
import { organizeAccounts } from "@/utils/filterAccounts";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { AccountMinimal } from "types";
import { AccountTreeView } from "./treeview/AccountTreeView";
import { useSession } from "next-auth/react";

export default function ChartOfAccounts({
  initialAccounts,
}: {
  initialAccounts: AccountMinimal[];
}) {
  const [accounts, setAccounts] = useState<AccountMinimal[]>(initialAccounts);
  const [isModalOpen, setIsModalOpen] = useState<{
    type: "add" | "edit" | "add-sub";
    open: boolean;
  }>({ type: "add", open: false });
  const [editingAccount, setEditingAccount] = useState<AccountMinimal | null>(
    null
  );
  const [parentAccount, setParentAccount] = useState<AccountMinimal | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();

  // Get root level accounts (accounts with no parent)
  // const rootAccounts = accounts.filter(account => !account.parentAccountId);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsModalOpen({ type: "add", open: true });
  };

  const handleEditAccount = (account: AccountMinimal) => {
    // setParentAccount(accounts.find(a => a.id === account.parentAccountId) || null);
    setEditingAccount(account);
    setIsModalOpen({ type: "edit", open: true });
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
    const workspaceId = session?.user?.currentWorkspace ?? "";
    const reloadedAccounts = await getAccountsAction(workspaceId);
    setAccounts(reloadedAccounts.accounts as AccountMinimal[]);
  };

  const handleChangeSubAccountParent = async (
    accountId: string,
    parentAccountId: string
  ) => {
    const toastId = toast.loading(`Updating account...`);

    try {
      const { accounts } = await changeAccountParentAction(
        accountId,
        parentAccountId
      );
      setAccounts(accounts as unknown as AccountMinimal[]);
      toast.dismiss(toastId);
    } catch (error) {
      console.error(error);
      toast.error((error as any).message || "Failed to save account", {
        id: toastId,
      });
      toast.dismiss(toastId);
    }
  };
  const handleSaveAccount = (account: AccountMinimal) => {
    const toastId = toast.loading(`Saving account...`);
    const workspaceId = session?.user?.currentWorkspace ?? "";

    try {
      if (editingAccount) {
        updateAccountAction(account.id, {
          name: account.name,
          number: account.number,
          balance: account.balance,
          type: account.type,
          parentAccountId: account.parentAccountId ?? undefined,
          workspaceId,
        }).then(() => reloadAccounts());
        setAccounts(accounts.map((a) => (a.id === account.id ? account : a)));
      } else {
        createAccountAction({
          name: account.name,
          number: account.number,
          balance: account.balance,
          type: account.type,
          parentAccountId: account.parentAccountId ?? undefined,
          workspaceId,
        }).then(() => {
          reloadAccounts();
          toast.dismiss(toastId);
        });
        setAccounts([...accounts, { ...account, id: "" }]);
      }
      setIsModalOpen({ type: "add", open: false });
    } catch (error) {
      console.error(error);
      toast.error((error as any).message || "Failed to save account", {
        id: toastId,
      });
      toast.dismiss(toastId);
    }
  };

  const filteredAccounts = searchTerm
    ? accounts.filter(
        (account) =>
          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : accounts;

  const handleAddSubAccount = (parentAccountId: string) => {
    setParentAccount(
      accounts.find((account) => account.id === parentAccountId) || null
    );
    setIsModalOpen({ type: "add-sub", open: true });
  };

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
            Add Core Account
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
          <Paper sx={{ p: 2, minHeight: 400 }}>
            <AccountTreeView
              accounts={organizeAccounts(filteredAccounts)}
              onAccountDelete={handleDeleteAccount}
              onSubAccountAdd={handleAddSubAccount}
              handleEditAccount={handleEditAccount}
              handleChangeSubAccountParent={handleChangeSubAccountParent}
            />

            {/* <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ 
                flexGrow: 1,
                '& .MuiTreeItem-content': {
                  py: 1
                }
              }}
            >
              {filteredAccounts.map(account =>
                renderTree(account, handleEditAccount, handleDeleteAccount)
              )}
            </TreeView> */}
          </Paper>
        </Grid>
      </Grid>
      <AccountModal
        open={isModalOpen.open}
        onClose={() => setIsModalOpen({ type: "add", open: false })}
        onSave={handleSaveAccount}
        action={isModalOpen.type}
        parentAccount={parentAccount}
        currentAccount={editingAccount}
      />
    </Container>
  );
}
