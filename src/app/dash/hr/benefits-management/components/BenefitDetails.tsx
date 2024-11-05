import {
  assignEmployeeBenefitAction,
  removeEmployeeBenefitAction,
} from "@/lib/actions/core-accounting/hr-actions";
import { fromPascalToReadable } from "@/utils/formetter";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Benefit, BenefitType } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface BenefitDetailsProps {
  benefits: Benefit[];
  reloadEmployeeDetails: () => Promise<void>;
  employeeId: string;
  workspaceId: string;
}

export default function BenefitDetails({
  benefits,
  employeeId,
  workspaceId,
  reloadEmployeeDetails,
}: BenefitDetailsProps) {
  const [openModal, setOpenModal] = useState(false);
  const [newBenefit, setNewBenefit] = useState<Omit<Benefit, "id">>({
    type: BenefitType.HEALTH_INSURANCE,
    value: 0,
    effectiveDate: new Date(),
    endDate: null,
    isTaxable: false,
    benefitCalculationJson: {},
    employeeId,
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    workspaceId,
  });

  useEffect(() => {}, []);

  const handleAddNewBenefit = async () => {
    let toastId = "";
    try {
      toastId = toast.loading("Adding Benefit...");
      await assignEmployeeBenefitAction(newBenefit);
      toast.dismiss(toastId);
      toast.success("Benefit Added Successfully");
      setOpenModal(false);
      reloadEmployeeDetails();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to add benefit");
    }
  };

  const handleDeleteBenefit = async (benefitId: string) => {
    let toastId = "";
    try {
      toastId = toast.loading("Deleting Benefit...");
      // Call your delete action here, e.g., await deleteEmployeeBenefitAction(benefitId);
      await removeEmployeeBenefitAction(benefitId);
      toast.dismiss(toastId);
      toast.success("Benefit Deleted Successfully");
      reloadEmployeeDetails();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to delete benefit");
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Benefit Details
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        Add New Benefit
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Effective Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Taxable</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {benefits.map((benefit) => (
              <TableRow key={benefit.id}>
                <TableCell>{fromPascalToReadable(benefit.type)}</TableCell>
                <TableCell>{benefit.value}</TableCell>
                <TableCell>
                  {new Date(benefit.effectiveDate)
                    .toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "-")}
                </TableCell>
                <TableCell>
                  {benefit.endDate
                    ? new Date(benefit.endDate)
                        .toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")
                    : "N/A"}
                </TableCell>
                <TableCell>{benefit.isTaxable ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteBenefit(benefit.id)}
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
          <Select
            fullWidth
            value={newBenefit.type}
            onChange={(e) => {
              setNewBenefit((prev) => ({
                ...prev,
                type: e.target.value as BenefitType,
              }));
            }}
            margin="dense"
          >
            {Object.values(BenefitType).map((type) => (
              <MenuItem key={type} value={type}>
                {fromPascalToReadable(type)}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Value"
            type="number"
            value={newBenefit.value}
            onChange={(e) =>
              setNewBenefit((prev) => ({
                ...prev,
                value: parseFloat(e.target.value) || 0,
              }))
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Effective Date"
            type="date"
            value={newBenefit.effectiveDate?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setNewBenefit((prev) => ({
                ...prev,
                effectiveDate: new Date(e.target.value),
              }))
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={newBenefit.endDate?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setNewBenefit((prev) => ({
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
                checked={newBenefit.isTaxable}
                onChange={(e) =>
                  setNewBenefit((prev) => ({
                    ...prev,
                    isTaxable: e.target.checked,
                  }))
                }
              />
            }
            label="Is Taxable"
          />
          <TextField
            fullWidth
            label="Description"
            value={newBenefit.description}
            onChange={(e) =>
              setNewBenefit((prev) => ({
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
