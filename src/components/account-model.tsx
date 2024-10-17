import { ERROR_MESSAGE } from "@/const";
import {
  createAccountAction,
  updateAccountAction,
} from "@/lib/actions/core-accounting/account-actions";
import { HttpError } from "@/utils/errorHandler";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { AccountType } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AccountMinimal } from "types";

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (account: AccountMinimal) => void;
  account: AccountMinimal | null;
  accounts: AccountMinimal[];
}

export default function AccountModal({
  open,
  onClose,
  onSave,
  account,
  accounts,
}: AccountModalProps) {
  const [formData, setFormData] = useState<AccountMinimal>({
    id: "",
    number: "",
    name: "",
    type: "ASSET",
    balance: 0,
    status: "ACTIVE",
    parentAccountId: "",
  });

  useEffect(() => {
    if (account) {
      setFormData(account);
    } else {
      setFormData({
        id: "",
        number: "",
        name: "",
        type: "ASSET",
        balance: 0,
        status: "ACTIVE",
        parentAccountId: "",
      });
    }
  }, [account]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: any; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked ? "ACTIVE" : "INACTIVE",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (account) {
        const result = await updateAccountAction(account.id, formData as any);
        onSave(result.account as AccountMinimal);
      } else {
        const result = await createAccountAction({
          name: formData.name as string,
          number: formData.number as string,
          type: formData.type as AccountType,
          parentAccountId: formData.parentAccountId as string,
        });
        onSave(result.account as AccountMinimal);
      }
    } catch (error) {
      if (error instanceof HttpError) {
        toast.error(`${error.message}`);
      } else {
        console.error(error);
        toast.error(ERROR_MESSAGE);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">
          {account ? "Edit Account" : "Add New Account"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="number"
            label="Account Number"
            type="text"
            fullWidth
            required
            value={formData.number}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="name"
            label="Account Name"
            type="text"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="account-type-label">Account Type</InputLabel>
            <Select
              labelId="account-type-label"
              name="type"
              value={formData.type}
              // @ts-expect-error unk
              onChange={handleChange}
              required
            >
              <MenuItem value="ASSET">Asset</MenuItem>
              <MenuItem value="LIABILITY">Liability</MenuItem>
              <MenuItem value="EQUITY">Equity</MenuItem>
              <MenuItem value="REVENUE">Revenue</MenuItem>
              <MenuItem value="EXPENSE">Expense</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="balance"
            label="Balance"
            type="number"
            fullWidth
            required
            value={formData.balance}
            onChange={handleChange}
            InputProps={{
              startAdornment: "$",
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.status === "ACTIVE"}
                onChange={handleStatusChange}
                name="status"
                color="primary"
              />
            }
            label="Active"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="parent-account-label">Parent Account</InputLabel>
            <Select
              labelId="parent-account-label"
              name="parentAccountId"
              value={formData.parentAccountId}
              // @ts-expect-error unk
              onChange={handleChange}
            >
              <MenuItem value="">None</MenuItem>
              {accounts.map((acc) => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
