import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { Reimbursement } from '@prisma/client';
 
interface EditReimbursementDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reimbursement: Reimbursement) => void;
  reimbursement: Reimbursement | null;
}

const initialAccounts = ['General Expenses', 'Travel', 'Meals and Entertainment'];

export default function EditReimbursementDialog({ open, onClose, onSubmit, reimbursement }: EditReimbursementDialogProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Pending');
  const [account, setAccount] = useState('');
  const [newAccount, setNewAccount] = useState('');
  const [accounts, setAccounts] = useState(initialAccounts);
  const [errors, setErrors] = useState({ description: '', amount: '' });

  useEffect(() => {
    if (reimbursement) {
      setDescription(reimbursement.description);
      setAmount(reimbursement.amount.toString());
      setStatus(reimbursement.status);
      setAccount(reimbursement.account);
    }
  }, [reimbursement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { description: '', amount: '' };

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (newErrors.description || newErrors.amount) {
      setErrors(newErrors);
      return;
    }

    if (reimbursement) {
      onSubmit({
        ...reimbursement,
        description,
        amount: amountValue,
        status,
        account,
      });
    }

    onClose();
  };

  const handleAddNewAccount = () => {
    if (newAccount && !accounts.includes(newAccount)) {
      setAccounts([...accounts, newAccount]);
      setAccount(newAccount);
      setNewAccount('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Reimbursement</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={!!errors.amount}
            helperText={errors.amount}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value as Reimbursement['status'])}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Reimbursement Account</InputLabel>
            <Select value={account} onChange={(e) => setAccount(e.target.value)}>
              {accounts.map((acc) => (
                <MenuItem key={acc} value={acc}>
                  {acc}
                </MenuItem>
              ))}
              <MenuItem value="new">
                <em>Add New Account</em>
              </MenuItem>
            </Select>
          </FormControl>
          {account === 'new' && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TextField
                label="New Account Name"
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
                fullWidth
              />
              <Button onClick={handleAddNewAccount} sx={{ ml: 1 }}>
                Add
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}