import { useState, useEffect } from 'react'
import {
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { Employee, SalaryHistory } from '@prisma/client'

interface SalaryDetailsProps {
  employee: Employee
}

export default function SalaryDetails({ employee }: SalaryDetailsProps) {
  const [salaryDetails, setSalaryDetails] = useState({
    basicSalary: 0,
    deductions: 0,
    tax: 0,
    nassit: 0,
  })
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [newSalaryRecord, setNewSalaryRecord] = useState({
    baseSalary: 0,
    effectiveDate: '',
    notes: '',
  })

  useEffect(() => {
    // Fetch salary details and history from the server
    const fetchSalaryData = async () => {
      const detailsResponse = await fetch(`/api/salary/${employee.id}`)
      const detailsData = await detailsResponse.json()
      setSalaryDetails(detailsData)

      const historyResponse = await fetch(`/api/salary-history/${employee.id}`)
      const historyData = await historyResponse.json()
      setSalaryHistory(historyData)
    }
    fetchSalaryData()
  }, [employee.id])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setSalaryDetails((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const handleSave = async () => {
    // Save salary details to the server
    await fetch(`/api/salary/${employee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(salaryDetails),
    })
    // Refresh salary history
    const historyResponse = await fetch(`/api/salary-history/${employee.id}`)
    const historyData = await historyResponse.json()
    setSalaryHistory(historyData)
  }

  const handleAddNewSalary = async () => {
    // Add new salary record to the server
    await fetch(`/api/salary-history/${employee.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSalaryRecord),
    })
    setOpenModal(false)
    // Refresh salary history
    const historyResponse = await fetch(`/api/salary-history/${employee.id}`)
    const historyData = await historyResponse.json()
    setSalaryHistory(historyData)
  }

  const netSalary =
    salaryDetails.basicSalary -
    salaryDetails.deductions -
    salaryDetails.tax -
    salaryDetails.nassit

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Salary Details
      </Typography>
      <TextField
        fullWidth
        label="Basic Salary"
        name="basicSalary"
        type="number"
        value={salaryDetails.basicSalary}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Deductions"
        name="deductions"
        type="number"
        value={salaryDetails.deductions}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Tax"
        name="tax"
        type="number"
        value={salaryDetails.tax}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="NASSIT Contribution"
        name="nassit"
        type="number"
        value={salaryDetails.nassit}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Net Salary"
        value={netSalary}
        InputProps={{ readOnly: true }}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save Changes
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ ml: 2 }}
      >
        Add New Salary Record
      </Button>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Salary History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Base Salary</TableCell>
              <TableCell>Effective Date</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaryHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.baseSalary}</TableCell>
                <TableCell>{new Date(record.effectiveDate).toLocaleDateString()}</TableCell>
                <TableCell>{record.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Salary Record</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Base Salary"
            type="number"
            value={newSalaryRecord.baseSalary}
            onChange={(e) =>
              setNewSalaryRecord((prev) => ({
                ...prev,
                baseSalary: parseFloat(e.target.value) || 0,
              }))
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Effective Date"
            type="date"
            value={newSalaryRecord.effectiveDate}
            onChange={(e) =>
              setNewSalaryRecord((prev) => ({
                ...prev,
                effectiveDate: e.target.value,
              }))
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Notes"
            value={newSalaryRecord.notes}
            onChange={(e) =>
              setNewSalaryRecord((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleAddNewSalary} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}