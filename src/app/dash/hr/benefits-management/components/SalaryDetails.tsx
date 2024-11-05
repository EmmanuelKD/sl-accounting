import { useState, useEffect } from "react";
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
  Grid,
} from "@mui/material";
import { Salary, SalaryHistory } from "@prisma/client";
 
interface SalaryDetailsProps {
  salary: Salary;
  salaryHistory: SalaryHistory[];
  reloadEmployeeDetails: () => Promise<void>;
}

export default function SalaryDetails({
  salary,
  salaryHistory,
}: SalaryDetailsProps) {
  const [salaryDetails, setSalaryDetails] = useState<Salary>(salary);
  const [openModal, setOpenModal] = useState(false);
  const [newSalaryRecord, setNewSalaryRecord] = useState({
    baseSalary: 0,
    effectiveDate: "",
    notes: "",
  });

  useEffect(() => {}, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSalaryDetails((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSave = async () => {
    // await updateSalary(employee.id, salaryDetails)
    // const updatedSalaryHistory = await getSalaryHistory(employee.id)
    // setSalaryHistory(updatedSalaryHistory)
  };

  const handleAddNewSalary = async () => {
    // await addSalaryHistory(employee.id, newSalaryRecord)
    // setOpenModal(false)
    // const updatedSalaryHistory = await getSalaryHistory(employee.id)
    // setSalaryHistory(updatedSalaryHistory)
  };

  const netSalary =
    salaryDetails.basicSalary -
    // salaryDetails.deductions -
    salaryDetails.tax -
    salaryDetails.NASSIT;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Salary Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Basic Salary"
            name="basicSalary"
            type="number"
            value={salaryDetails.basicSalary}
            onChange={handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Deductions"
            name="deductions"
            type="number"
            value={salaryDetails.deductions}
            onChange={handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            disabled
            label="PAYT"
            name="tax"
            type="number"
            value={salaryDetails.tax}
            onChange={handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="NASSIT Contribution"
            name="nassit"
            disabled
            type="number"
            value={salaryDetails.NASSIT}
            onChange={handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Net Salary (takehome)"
            value={netSalary}
            disabled
            InputProps={{ readOnly: true }}
            margin="normal"
          />
        </Grid>
      </Grid>
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
                <TableCell>
                  {new Date(record.lastEffectiveDate).toLocaleDateString()}
                </TableCell>
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
  );
}
