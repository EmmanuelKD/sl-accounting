"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { AccountMinimal } from "types";

export interface InputedEntry {
  debitedAccountId: string;
  creditedAccountId: string;
  creditTransactionId: string;
  debitTransactionId: string;
  amount: number;
  note: string;
}

interface EntriesProps {
  entry: InputedEntry;
  index: number;
  accounts: AccountMinimal[];
  updateEntry: (
    index: number,
    field: keyof InputedEntry,
    value: string | number | null
  ) => void;
  getAvailableAccounts: (
    currentEntries: InputedEntry,
    field: "debitedAccountId" | "creditedAccountId"
  ) => AccountMinimal[];
}

const EntriesForm: React.FC<EntriesProps> = ({
  entry,
  index,
  updateEntry,
  getAvailableAccounts,
}) => {
  return (
    <Paper sx={{ mb: 3, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Entry {index + 1}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <FormControl sx={{ flexBasis: "calc(50% - 8px)" }}>
          <InputLabel id={`from-account-label-${index}`}>
            From Account (Debit)
          </InputLabel>
          <Select
            labelId={`from-account-label-${index}`}
            value={entry.debitedAccountId}
            label="From Account"
            onChange={(e) =>
              updateEntry(index, "debitedAccountId", e.target.value)
            }
          >
            {getAvailableAccounts(entry, "debitedAccountId").map(
              (account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        <FormControl sx={{ flexBasis: "calc(50% - 8px)" }}>
          <InputLabel id={`to-account-label-${index}`}>
            To Account (Credit)
          </InputLabel>
          <Select
            labelId={`to-account-label-${index}`}
            value={entry.creditedAccountId}
            label="To Account"
            onChange={(e) =>
              updateEntry(index, "creditedAccountId", e.target.value)
            }
          >
            {getAvailableAccounts(entry, "creditedAccountId").map(
              (account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        <TextField
          label="Amount"
          type="number"
          value={entry.amount}
          onChange={(e) =>
            updateEntry(index, "amount", parseFloat(e.target.value))
          }
          sx={{ flexGrow: 1 }}
        />
        <TextField
          label="Note"
          value={entry.note}
          onChange={(e) => updateEntry(index, "note", e.target.value)}
          fullWidth
          sx={{ flexBasis: "100%" }}
        />
      </Box>
    </Paper>
  );
};

export default EntriesForm;
