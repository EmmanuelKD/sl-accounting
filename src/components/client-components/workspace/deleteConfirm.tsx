import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'

interface DeleteConfirmationProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteWorkspaceConfirmation({ open, onClose, onConfirm }: DeleteConfirmationProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete this workspace? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}