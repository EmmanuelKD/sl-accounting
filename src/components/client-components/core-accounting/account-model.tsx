"use client";
import {
  ASSETS_ACCOUNT,
  CONTRA_ASSETS_ACCOUNT,
  EQUITY_ACCOUNT,
  ERROR_MESSAGE,
  EXPENSES_ACCOUNT,
  LIABILITIES_ACCOUNT,
  REVENUE_ACCOUNT,
} from "@/const";
import { HttpError } from "@/utils/errorHandler";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AccountType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AccountMinimal } from "types";

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (account: AccountMinimal) => void;
  parentAccount: AccountMinimal | null;
  currentAccount: AccountMinimal | null;
  action: "add" | "edit" | "add-sub";
}

export default function AccountModal({
  open,
  onClose,
  onSave,
  parentAccount,
  currentAccount,
  action,
}: AccountModalProps) {
  const { data: session } = useSession();
  
  // Initial form state based on action type
  const getInitialFormState = () => {
    const workspaceId = session?.user?.currentWorkspace ?? "";
    // alert(workspaceId);
    if (action === "edit" && currentAccount) {
      return { ...currentAccount };
    } else {
      return {
        id: "",
        number: "",
        name: "",
        type: "ASSET",
        balance: 0,
        parentAccountId: action === "add-sub" ? parentAccount?.id || "" : "",
        workspaceId: workspaceId,
      } satisfies AccountMinimal;
    }
  };
  const initialFormState = getInitialFormState();
  const [formData, setFormData] = useState<AccountMinimal>(initialFormState);

  useEffect(() => {
    setFormData(initialFormState);
  }, [currentAccount, parentAccount, action]);

  // Add this function to get default values based on account type
  const getDefaultAccountValues = (type: string) => {
    const defaults: {
      [key: string]: { number: string; name: string; type: AccountType };
    } = {
      ["Assets"]: { number: "1000", name: "Assets", type: "ASSET" },
      ["Liabilities"]: {
        number: "2000",
        name: "Liabilities",
        type: "LIABILITY",
      },
      ["Equity"]: { number: "3000", name: "Equity", type: "EQUITY" },
      ["Revenue"]: { number: "4000", name: "Revenue", type: "REVENUE" },
      ["Expenses"]: { number: "5000", name: "Expenses", type: "EXPENSE" },
      ["Contra Assets"]: {
        number: "1100",
        name: "Contra Assets",
        type: "CONTRA_ASSET",
      },
    };
    return defaults[type] || { number: "", name: "" };
  };

  // Modify handleChange to update number and name when type changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: any; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "type" && action === "add") {
        const defaultValues = getDefaultAccountValues(value as string);
        return {
          ...prev,
          [name]: value,
          ...defaultValues,
        };
      }
      return { ...prev, [name]: value };
    });
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
      onSave(formData as AccountMinimal);
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
          {action === "add-sub"
            ? `New Sub Account for ${parentAccount?.name}`
            : action === "edit"
            ? "Edit Account"
            : "Add New Account"}
        </DialogTitle>
        <DialogContent>
          {action === "add" && (
            <FormControl fullWidth margin="dense">
              <InputLabel id="account-type-label">Account Type</InputLabel>
              <Select
                labelId="account-type-label"
                name="type"
                value={formData.name}
                // @ts-expect-error unk
                onChange={handleChange}
                required
              >
                <MenuItem value={"Assets"}>Asset</MenuItem>
                <MenuItem value={"Liabilities"}>Liability</MenuItem>
                <MenuItem value={"Equity"}>Equity</MenuItem>
                <MenuItem value={"Revenue"}>Revenue</MenuItem>
                <MenuItem value={"Expenses"}>Expense</MenuItem>
                <MenuItem value={"Contra Assets"}>Contra Asset</MenuItem>
              </Select>
            </FormControl>
          )}
        
          <TextField
          
            autoFocus
            margin="dense"
            name="number"
            label="Account Number"
            type="text"
            disabled={action === "add"}
            fullWidth
            required
            value={formData.number}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="name"
            disabled={action === "add"}
            label="Account Name"
            type="text"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
          />

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
