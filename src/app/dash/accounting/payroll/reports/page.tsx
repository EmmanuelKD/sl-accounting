import React, { useState } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';

const data = [
  { month: 'Jan', payroll: 400000 },
  { month: 'Feb', payroll: 420000 },
  { month: 'Mar', payroll: 430000 },
  { month: 'Apr', payroll: 450000 },
  { month: 'May', payroll: 460000 },
  { month: 'Jun', payroll: 470000 },
];

export default function Reports() {
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('2023');

  const handleExport = (format: 'csv' | 'pdf') => {
    // Implement export logic here
    console.log(`Exporting ${format} report for ${department} department in ${year}`);
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Payroll Reports
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              label="Department"
              onChange={(e) => setDepartment(e.target.value)}
            >
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
            >
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => handleExport('csv')}>
              Export CSV
            </Button>
            <Button variant="contained" onClick={() => handleExport('pdf')}>
              Export PDF
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ height: 400, mt: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="payroll" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Layout>
  );
}