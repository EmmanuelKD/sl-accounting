import { Typography } from '@mui/material'
import IncomeStatement from './IncomeStatement';
import BalanceSheet from './BalanceSheet';
import CashFlowStatement from './Cashflow';

interface FinancialData {
  income: { revenue: number; expenses: number; netIncome: number };
  balance: {
    assets: { name: string; value: number }[];
    liabilities: { name: string; value: number }[];
    equity: { name: string; value: number }[];
  };
  cashflow: {
    operating: { name: string; value: number }[];
    investing: { name: string; value: number }[];
    financing: { name: string; value: number }[];
  };
}

async function fetchFinancialData(type: string, start: string, end: string): Promise<FinancialData[keyof FinancialData]> {
  // Implement your data fetching logic here
  // This is a placeholder implementation
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API delay
  return {
    income: { revenue: 100000, expenses: 80000, netIncome: 20000 },
    balance: { 
      assets: [{ name: 'Cash', value: 50000 }, { name: 'Receivables', value: 30000 }],
      liabilities: [{ name: 'Accounts Payable', value: 20000 }],
      equity: [{ name: 'Retained Earnings', value: 60000 }]
    },
    cashflow: {
      operating: [{ name: 'Net Income', value: 20000 }],
      investing: [{ name: 'Capital Expenditures', value: -10000 }],
      financing: [{ name: 'Dividends Paid', value: -5000 }]
    }
  }[type as keyof FinancialData]
}

interface FinancialStatementContentProps {
  type: string;
  start: string;
  end: string;
}

export default async function FinancialStatementContent({ type, start, end }: FinancialStatementContentProps) {
  const data = await fetchFinancialData(type, start, end)

  if (!data) {
    return <Typography>No data available for the selected period</Typography>
  }

  switch (type) {
    case 'income':
      return <IncomeStatement data={data as FinancialData['income']} />
    case 'balance':
      return <BalanceSheet data={data as FinancialData['balance']} />
    case 'cashflow':
      return <CashFlowStatement data={data as FinancialData['cashflow']} />
    default:
      return <Typography>Invalid statement type</Typography>
  }
}