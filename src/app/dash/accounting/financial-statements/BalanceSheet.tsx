import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

interface BalanceSheetItem {
  name: string;
  value: number;
}

interface BalanceSheetData {
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
}

interface BalanceSheetProps {
  data: BalanceSheetData;
}

export default function BalanceSheet({ data }: BalanceSheetProps) {
  const totalAssets = data.assets.reduce((sum, item) => sum + item.value, 0)
  const totalLiabilities = data.liabilities.reduce((sum, item) => sum + item.value, 0)
  const totalEquity = data.equity.reduce((sum, item) => sum + item.value, 0)

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="balance sheet table">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Assets</TableCell>
          </TableRow>
          {data.assets.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">${item.value.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Total Assets</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>${totalAssets.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Liabilities</TableCell>
          </TableRow>
          {data.liabilities.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">${item.value.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Total Liabilities</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>${totalLiabilities.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Equity</TableCell>
          </TableRow>
          {data.equity.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">${item.value.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Total Equity</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>${totalEquity.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Total Liabilities and Equity</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>${(totalLiabilities + totalEquity).toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}