import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
  } from '@mui/material'
  
  interface DeleteUserConfirmationProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
  }
  
  export default function DeleteUserConfirmation({ open, onClose, onConfirm }: DeleteUserConfirmationProps) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>No</Button>
          <Button onClick={onConfirm} color="error" variant="contained">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  }