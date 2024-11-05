import { useState } from 'react'
import { List, ListItem, ListItemText, TextField, Typography } from '@mui/material'
import { Employee } from '@prisma/client'

interface EmployeeListProps {
  employees: Employee[]
  onSelectEmployee: (employee: Employee) => void
}

export default function EmployeeList({ employees, onSelectEmployee }: EmployeeListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employmentStatus.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Employees
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Search employees"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />
      <List>
        {filteredEmployees.map((employee) => (
          <ListItem
            key={employee.id}
            button
            onClick={() => onSelectEmployee(employee)}
          >
            <ListItemText
              primary={`${employee.firstName} ${employee.lastName}`}
              secondary={employee.department}
            />
          </ListItem>
        ))}
      </List>
    </>
  )
}