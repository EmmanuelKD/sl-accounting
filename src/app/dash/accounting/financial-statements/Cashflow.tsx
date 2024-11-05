import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

interface CashFlowItem {
  name: string;
  value: number;
}

interface CashFlowData {
  operating: CashFlowItem[];
  investing: CashFlowItem[];
  financing: CashFlowItem[];
}

interface CashFlowStatementProps {
  data: CashFlowData;
}

export default function CashFlowStatement({ data }: CashFlowStatementProps) {
  const totalOperating = data.operating.reduce((sum, item) => sum + item.value, 0)
  const totalInvesting = data.investing.reduce((sum, item) => sum + item.value, 0)
  const totalFinancing = data.financing.reduce((sum, item) => sum + item.value, 0)
  const netCashFlow = totalOperating + totalInvesting + totalFinancing

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="cash flow statement table">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Operating  Activities</TableCell>
          </TableRow>
          {data.operating.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">${item.value.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Net Cash from Operating Activities</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>${totalOperating.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Investing Activities</TableCell>
          </TableRow>
          {data.investing.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">${item.value.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Net Cash from Investing Activities</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>${totalInvesting.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Financing Activities</TableCell>
          </TableRow>
          {data.financing.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">${item.value.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Net Cash from Financing Activities</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>${totalFinancing.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Net Cash Flow</TableCell>
            <TableCell 
              align="right" 
              sx={{ 
                fontWeight: 'bold',
                color: netCashFlow >= 0 ? 'green' : 'red'
              }}
            >
              ${netCashFlow.toLocaleString()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}