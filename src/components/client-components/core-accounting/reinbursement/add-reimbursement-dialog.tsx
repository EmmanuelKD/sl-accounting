import React, { useState } from 'react';
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
import { Reimbursement, ReimbursementStatus } from '@prisma/client';
 
interface AddReimbursementDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reimbursement: Omit<Reimbursement, 'id'>) => void;
}

const initialAccounts = ['General Expenses', 'Travel', 'Meals and Entertainment'];

export default function AddReimbursementDialog({ open, onClose, onSubmit }: AddReimbursementDialogProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Pending');
  const [account, setAccount] = useState('');
  const [newAccount, setNewAccount] = useState('');
  const [accounts, setAccounts] = useState(initialAccounts);
  const [errors, setErrors] = useState({ description: '', amount: '' });

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

    onSubmit({
      description,
      amount: amountValue,
      status: status as ReimbursementStatus,
      account,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setStatus('Pending');
    setAccount('');
    setErrors({ description: '', amount: '' });
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
      <DialogTitle>Add New Reimbursement</DialogTitle>
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
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
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
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}