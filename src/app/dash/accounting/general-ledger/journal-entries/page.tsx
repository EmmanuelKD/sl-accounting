"use client";
import AddPeriodDialog from "@/components/client-components/core-accounting/accounting-period";
import EntriesForm, {
  InputedEntry,
} from "@/components/client-components/core-accounting/journal-entry-form";
import { getAccountsAction } from "@/lib/actions/core-accounting/account-actions";
import { createJournalEntryAction } from "@/lib/actions/core-accounting/journal-entry-action";
import { paths } from "@/paths";
import {
  AppBar,
  Box,
  Button,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransactionType } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AccountMinimal } from "types";
import { v4 as uuidv4 } from "uuid";
const NewJournalEntryPage: React.FC = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [entries, setEntries] = useState<InputedEntry[]>([
    {
      amount: 0,
      creditedAccountId: "",
      debitedAccountId: "",
      creditTransactionId: uuidv4(),
      debitTransactionId: uuidv4(),
      note: "",
    },
  ]);
  const [accounts, setAccounts] = useState<AccountMinimal[]>([]);

  const initAccounts = async () => {
    const initialAccounts = await getAccountsAction();
    setAccounts(initialAccounts.accounts);
  };

  useEffect(() => {
    initAccounts();
  }, []);

  const { data: session } = useSession();
  const user = session?.user;

  const addTransaction = () => {
    if (validateTransactions()) {
      setEntries([
        ...entries,
        {
          amount: 0,
          creditedAccountId: "",
          debitedAccountId: "",
          creditTransactionId: uuidv4(),
          debitTransactionId: uuidv4(),
          note: "",
        },
      ]);
    }
  };

  const updateEntry = (
    index: number,
    field: keyof InputedEntry,
    value: string | number | null
  ) => {
   
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value,
    };

    setEntries(updatedEntries);
  };

  const getAvailableAccounts = (
    currentEntry: InputedEntry,
    field: "debitedAccountId" | "creditedAccountId"
  ) => {
    if (field === "debitedAccountId") {
      return accounts.filter(
        (account) => account.id !== currentEntry.creditedAccountId
      );
    } else {
      return accounts.filter(
        (account) => account.id !== currentEntry.debitedAccountId
      );
    }
  };

  const validateTransactions = () => {
    for (const transaction of entries) {
      if (
        !transaction.debitedAccountId ||
        !transaction.creditedAccountId ||
        transaction.amount <= 0
      ) {
        toast.error(
          "Please fill all required transaction fields (From Account, To Account, Amount).",
          {
            position: "bottom-center",
          }
        );
        return false;
      }
    }
    return true;
  };

  const saveEntry = async () => {
    if (!validateTransactions()) return;
    // @todo work onusers workspace
    const workspaceId = "cm2el4sot0002nhcysia1pnfu";
    const userId = "cm2ej47cz0009p1s7m19z6gvk";
    if (!user) {
      toast.error("User not found: Please login");
      router.push("/login");
      return;
    }

    const entriesTransaction = entries.reduce<
      Array<{
        amount: number;
        type: TransactionType;
        accountId: string;
        note: string;
        relatedTransactionId: string;
        id: string;
      }>
    >((prev, entry) => {
      const debitTransaction = {
        amount: entry.amount,
        type: "DEBIT" as TransactionType,
        accountId: entry.debitedAccountId,
        note: entry.note,
        relatedTransactionId: entry.creditTransactionId,
        id: entry.debitTransactionId,
      };
      const creditTransaction = {
        amount: entry.amount,
        type: "CREDIT" as TransactionType,
        accountId: entry.creditedAccountId,
        note: entry.note,
        relatedTransactionId: entry.debitTransactionId,
        id: entry.creditTransactionId,
      };

      return [...prev, debitTransaction, creditTransaction];
    }, []);
    
    await createJournalEntryAction({
      description,
      dateOfEntry: new Date(date),
      transactions: entriesTransaction,
      workspaceId,
      createdBy: userId,
      // user.id as string,
    })
      .then(() => {
        toast.success("Journal Entry saved successfully!");
        router.push(paths.dashboard.accounting.general_ledger.index);
      })
      .catch((error) => {
        toast.error("Failed to save Journal Entry: " + error.message);
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h4" style={{ flexGrow: 1 }}>
            New Journal Entry
          </Typography>

          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={2}
          >
            <AddPeriodDialog color="inherit" />
            <Button
              variant="contained"
              color="inherit"
              LinkComponent={Link}
              href={paths.dashboard.accounting.general_ledger.chart_of_accounts}
              size="small"
            >
              Chart of Accounts
            </Button>

            <Button
              variant="contained"
              color="primary"
              LinkComponent={Link}
              href={
                paths.dashboard.accounting.general_ledger.journal_entries
                  .reimbursement
              }
            >
              New Reimbursement
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Entries
      </Typography>

      {entries.map((entry, index) => (
        <EntriesForm
          index={index}
          key={index}
          entry={entry}
          accounts={accounts}
          updateEntry={updateEntry}
          getAvailableAccounts={getAvailableAccounts}
        />
      ))}

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button onClick={addTransaction} variant="outlined">
          Add Transaction
        </Button>
        <Button onClick={saveEntry} variant="contained" color="primary">
          Save Entry
        </Button>
      </Box>
    </Box>
  );
};

export default NewJournalEntryPage;
