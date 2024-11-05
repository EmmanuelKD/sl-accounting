import {
  assignEmployeeDeductionAction,
  removeEmployeeDeductionAction,
} from "@/lib/actions/core-accounting/hr-actions";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { BenefitType, Deduction } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DeductionDetailsProps {
  deductions: Deduction[];
  reloadEmployeeDetails: () => Promise<void>;
  employeeId: string;
  workspaceId: string;
}

export default function DeductionDetails({
  deductions,
  employeeId,
  workspaceId,
  reloadEmployeeDetails,
}: DeductionDetailsProps) {
  // const [deductions, setDeduction] = useState<Benefit[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [newDeduction, setNewDeductions] = useState<Omit<Deduction, "id">>({
    name: "",
    amount: 0,
    startDate: new Date(),
    endDate: null,
    isTaxExempt: true,
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    workspaceId,
    employeeId,
  });

  useEffect(() => {}, [employeeId]);

  const handleAddNewBenefit = async () => {
    let toastId = "";

    try {
      toastId = toast.loading("Adding Deduction...");
      await assignEmployeeDeductionAction(newDeduction);
      toast.dismiss(toastId);
      toast.success("Deduction Added Successfully");
      setOpenModal(false);
      reloadEmployeeDetails();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to add deduction");
    }
  };

  const handleDeleteDeduction = async (deductionId: string) => {
    let toastId = "";
    try {
      toastId = toast.loading("Deleting Deduction...");
      // Call your delete action here, e.g., await deleteEmployeeDeductionAction(deductionId);
      await removeEmployeeDeductionAction(deductionId);
      toast.dismiss(toastId);
      toast.success("Deduction Deleted Successfully");
      reloadEmployeeDetails();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to delete deduction");
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Deduction Details
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        Add New Deduction
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Effective Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Is Tax Exempt</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deductions.map((deduction) => (
              <TableRow key={deduction.id}>
                <TableCell>{deduction.name}</TableCell>
                <TableCell>{deduction.amount}</TableCell>
                <TableCell>
                  {new Date(deduction.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {deduction.endDate
                    ? new Date(deduction.endDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {deduction.isTaxExempt
                    ? "Pre Tax deduction"
                    : "Post Tax deduction"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteDeduction(deduction.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Benefit</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name of Deduction"
            type="text"
            value={newDeduction.name}
            onChange={(e) =>
              setNewDeductions((prev) => ({
                ...prev,
                name: e.target.value as BenefitType,
              }))
            }
            margin="dense"
          />
          <TextField
            fullWidth
            label="Value"
            type="number"
            value={newDeduction.amount}
            onChange={(e) =>
              setNewDeductions((prev) => ({
                ...prev,
                amount: parseFloat(e.target.value) || 0,
              }))
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Effective Date"
            type="date"
            value={newDeduction.startDate?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setNewDeductions((prev) => ({
                ...prev,
                startDate: new Date(e.target.value),
              }))
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={newDeduction.endDate?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setNewDeductions((prev) => ({
                ...prev,
                endDate: new Date(e.target.value),
              }))
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newDeduction.isTaxExempt}
                onChange={(e) =>
                  setNewDeductions((prev) => ({
                    ...prev,
                    isTaxExempt: e.target.checked,
                  }))
                }
              />
            }
            label="Is Tax Exempt"
          />
          <TextField
            fullWidth
            label="Description"
            value={newDeduction.description}
            onChange={(e) =>
              setNewDeductions((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleAddNewBenefit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
