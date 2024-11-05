// Import necessary libraries from MUI and Next.js
"use client";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  List,
  ListItem,
  Typography,
  Grid,
  Divider,
  Alert,
  ButtonPropsColorOverrides,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

// Mock Data for existing periods
const mockPeriods = [
  {
    id: uuidv4(),
    name: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    id: uuidv4(),
    name: "Q2 2024",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
  },
  {
    id: uuidv4(),
    name: "Annual 2023",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
  },
];

// Helper function to check if two periods overlap
const isOverlapping = (
  newStartDate: string,
  newEndDate: string,
  existingStartDate: string,
  existingEndDate: string
) => {
  return (
    new Date(newStartDate) <= new Date(existingEndDate) &&
    new Date(newEndDate) >= new Date(existingStartDate)
  );
};

const AddPeriodDialog = ({color}:{color?:any}) => {
  const [open, setOpen] = useState(false);
  const [periods, setPeriods] = useState(mockPeriods); // Use mock data as initial periods
  const [newPeriod, setNewPeriod] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [overlappingPeriod, setOverlappingPeriod] = useState<string | null>(
    null
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewPeriod({ name: "", startDate: "", endDate: "" });
    setOverlappingPeriod(null);
  };

  const handleAddPeriod = () => {
    const overlap = periods.find((period) =>
      isOverlapping(
        newPeriod.startDate,
        newPeriod.endDate,
        period.startDate,
        period.endDate
      )
    );

    if (overlap) {
      setOverlappingPeriod(overlap.name);
    } else {
      setPeriods([...periods, { id: uuidv4(), ...newPeriod }]);
      handleClose();
    }
  };

  return (
    <div>
      <Button size="small" variant="contained" color={color??"primary"} onClick={handleClickOpen}>
        Add Account Period
      </Button>

      {/* Dialog to add a period */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Accounting Perioda</DialogTitle>
        <DialogContent>
          {/* List of existing periods */}
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Existing Periods
          </Typography>
          <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            {periods.map((period) => (
              <ListItem
                key={period.id}
                style={{
                  color: overlappingPeriod === period.name ? "red" : "black",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <Typography>
                  {period.name} - {period.startDate} to {period.endDate}
                  {overlappingPeriod === period.name && (
                    <Typography variant="body2" color="error" component="span">
                      {" "}
                      (Overlapping period)
                    </Typography>
                  )}
                </Typography>
              </ListItem>
            ))}
          </List>
         
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Add New Period
          </Typography>
          <Grid container spacing={2} >
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Period Name"
                variant="outlined"
                value={newPeriod.name}
                onChange={(e) =>
                  setNewPeriod({ ...newPeriod, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={newPeriod.startDate}
                onChange={(e) =>
                  setNewPeriod({ ...newPeriod, startDate: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={newPeriod.endDate}
                onChange={(e) =>
                  setNewPeriod({ ...newPeriod, endDate: e.target.value })
                }
              />
            </Grid>

            {/* Display overlap warning if applicable */}
            {overlappingPeriod && (
              <Grid item xs={12}>
                <Typography color="error">
                  Overlapping period with {overlappingPeriod}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddPeriod} color="primary">
            Add Period
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddPeriodDialog;
