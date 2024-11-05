import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import { Department } from '@prisma/client'
 
interface DepartmentModalProps {
  open: boolean
  onClose: () => void
  onSave: (department: Department) => void
  department: Department | null
}

export default function DepartmentModal({
  open,
  onClose,
  onSave,
  department,
}: DepartmentModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (department) {
      setName(department.name)
      setDescription(department.description || '')
    } else {
      setName('')
      setDescription('')
    }
    setNameError('')
  }, [department])

  const handleSave = () => {
    if (!name.trim()) {
      setNameError('Department name is required')
      return
    }
    const workspaceId = "cm2el4sot0002nhcysia1pnfu";
    onSave({
      id: department?.id || "",
      workspaceId: workspaceId,
      name: name.trim(),
      description: description.trim(),
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="department-dialog-title">
      <DialogTitle id="department-dialog-title">
        {department ? 'Edit Department' : 'Add New Department'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Department Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
          required
        />
        <TextField
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}