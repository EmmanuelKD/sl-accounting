import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

interface IncomeStatementData {
  revenue: number;
  expenses: number;
  netIncome: number;
}

interface IncomeStatementProps {
  data: IncomeStatementData;
}

export default function IncomeStatement({ data }: IncomeStatementProps) {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="income statement table">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Revenue</TableCell>
            <TableCell align="right">${data.revenue.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Expenses</TableCell>
            <TableCell align="right">${data.expenses.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Net Income</TableCell>
            <TableCell 
              align="right"
              sx={{ 
                fontWeight: 'bold', 
                color: data.netIncome >= 0 ? 'green' : 'red'
              }}
            >
              ${data.netIncome.toLocaleString()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}