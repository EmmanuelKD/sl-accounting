import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface Transaction {
  id: number;
  date: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
  balance: number;
  createdBy?: string;
  transactions?: Array<{
    account: string;
    debit: number;
    credit: number;
  }>;
}

interface TransactionDialogProps {
  selectedEntry: Transaction | null;
  onClose: () => void;
}

export default function TransactionDialog({ selectedEntry, onClose }: TransactionDialogProps) {
  if (!selectedEntry) return null;

  return (
    <Dialog
      open={!!selectedEntry}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{selectedEntry.description}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Date: {selectedEntry.date} | Created by: {selectedEntry.createdBy || 'Unknown'}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Account</TableCell>
                <TableCell>Debit</TableCell>
                <TableCell>Credit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedEntry.transactions ? (
                selectedEntry.transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.account}</TableCell>
                    <TableCell>${transaction.debit.toFixed(2)}</TableCell>
                    <TableCell>${transaction.credit.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>{selectedEntry.account}</TableCell>
                  <TableCell>${selectedEntry.debit.toFixed(2)}</TableCell>
                  <TableCell>${selectedEntry.credit.toFixed(2)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}