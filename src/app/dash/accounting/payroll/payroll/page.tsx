"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";

export default function PayrollProcessing() {
  const [payrollPeriod, setPayrollPeriod] = useState("");
  const [includeDepartments, setIncludeDepartments] = useState({
    IT: true,
    HR: true,
    Finance: true,
    Marketing: true,
  });

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeDepartments({
      ...includeDepartments,
      [event.target.name]: event.target.checked,
    });
  };

  const handleProcessPayroll = () => {
    // Implement payroll processing logic here
    console.log("Processing payroll for:", payrollPeriod);
    console.log("Included departments:", includeDepartments);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Payroll Processing
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Payroll Period"
              type="month"
              value={payrollPeriod}
              onChange={(e) => setPayrollPeriod(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Include Departments
            </Typography>
            {Object.keys(includeDepartments).map((dept) => (
              <FormControlLabel
                key={dept}
                control={
                  <Checkbox
                    checked={
                      includeDepartments[
                        dept as keyof typeof includeDepartments
                      ]
                    }
                    onChange={handleDepartmentChange}
                    name={dept}
                  />
                }
                label={dept}
              />
            ))}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Payroll Summary
              </Typography>
              <Typography>Total Salaries: $450,000</Typography>
              <Typography>Total Taxes: $112,500</Typography>
              <Typography>Total Deductions: $45,000</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Net Payroll: $292,500
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleProcessPayroll}
            >
              Process Payroll
            </Button>
          </Grid>
        </Grid>
      </Paper>{" "}
    </>
  );
}
