import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, TextField, Box, Typography } from '@mui/material';
 
const columns: GridColDef[] = [
  { field: 'id', headerName: 'Employee ID', width: 130 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'department', headerName: 'Department', width: 150 },
  { field: 'role', headerName: 'Role', width: 150 },
  { field: 'salary', headerName: 'Salary', type: 'number', width: 130 },
  {
    field: 'action',
    headerName: 'Action',
    width: 150,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => {
          // Handle view/edit action
          console.log('View/Edit', params.row);
        }}
      >
        View/Edit
      </Button>
    ),
  },
];

const rows = [
  { id: 1, name: 'John Doe', department: 'IT', role: 'Developer', salary: 75000 },
  { id: 2, name: 'Jane Smith', department: 'HR', role: 'Manager', salary: 85000 },
  { id: 3, name: 'Bob Johnson', department: 'Finance', role: 'Accountant', salary: 70000 },
  // Add more employee data as needed
];

export default function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Employee List
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search Employees"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </>
  );
}