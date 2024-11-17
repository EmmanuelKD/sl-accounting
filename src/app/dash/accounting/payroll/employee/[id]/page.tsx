import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Box, Tabs, Tab, Grid } from '@mui/material';
 
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EmployeeDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [tabValue, setTabValue] = useState(0);
  const [employeeData, setEmployeeData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    salary: '75000',
    taxRate: '25',
    department: 'IT',
    position: 'Senior Developer',
    hireDate: '2020-01-15',
    annualLeave: '20',
    sickLeave: '10',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeData({
      ...employeeData,
      [event.target.name]: event.target.value,
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implement update logic here
    console.log('Updated employee data:', employeeData);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Employee Details - ID: {id}
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="employee details tabs">
            <Tab label="Personal Info" />
            <Tab label="Payroll Info" />
            <Tab label="Leave Balance" />
          </Tabs>
        </Box>
        <form onSubmit={handleSubmit}>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={employeeData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={employeeData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={employeeData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={employeeData.address}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  
                  label="Salary"
                  name="salary"
                  value={employeeData.salary}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tax Rate (%)"
                  name="taxRate"
                  value={employeeData.taxRate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={employeeData.department}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  name="position"
                  value={employeeData.position}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hire Date"
                  name="hireDate"
                  type="date"
                  value={employeeData.hireDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Annual Leave Balance"
                  name="annualLeave"
                  value={employeeData.annualLeave}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sick Leave Balance"
                  name="sickLeave"
                  value={employeeData.sickLeave}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}