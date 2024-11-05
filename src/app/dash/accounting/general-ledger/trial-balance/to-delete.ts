 
export interface TrialBalanceEntry {
  accountName: string
  accountNumber: string
  debit: number
  credit:  number
  balance: number
}
// Mock data (replace with actual API calls in a real application)
const mockTrialBalanceData: TrialBalanceEntry[] = [
  { accountName: 'Cash', accountNumber: '1000', debit: 10000, credit: 0, balance: 10000 },
  { accountName: 'Accounts Receivable', accountNumber: '1100', debit: 5000, credit: 0, balance: 5000 },
  { accountName: 'Inventory', accountNumber: '1200', debit: 15000, credit: 0, balance: 15000 },
  { accountName: 'Accounts Payable', accountNumber: '2000', debit: 0, credit: 8000, balance: -8000 },
  { accountName: 'Loans Payable', accountNumber: '2100', debit: 0, credit: 10000, balance: -10000 },
  { accountName: 'Capital Stock', accountNumber: '3000', debit: 0, credit: 20000, balance: -20000 },
  { accountName: 'Retained Earnings', accountNumber: '3100', debit: 0, credit: 5000, balance: -5000 },
  { accountName: 'Sales Revenue', accountNumber: '4000', debit: 0, credit: 30000, balance: -30000 },
  { accountName: 'Cost of Goods Sold', accountNumber: '5000', debit: 20000, credit: 0, balance: 20000 },
  { accountName: 'Salaries Expense', accountNumber: '6000', debit: 15000, credit: 0, balance: 15000 },
  { accountName: 'Rent Expense', accountNumber: '6100', debit: 5000, credit: 0, balance: 5000 },
  { accountName: 'Utilities Expense', accountNumber: '6200', debit: 3000, credit: 0, balance: 3000 },
]

export async function fetchTrialBalanceData(startDate?: Date | null, endDate?: Date | null): Promise<TrialBalanceEntry[]> {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // In a real application, you would use the startDate and endDate to filter the data
  // For this mock implementation, we'll just return all the data
  return mockTrialBalanceData
}
