import { Metadata } from 'next'
import { fetchTrialBalanceData } from './to-delete'
import TrialBalanceContent from './trial-balance-main'
 

export const metadata: Metadata = {
  title: 'Trial Balance | Accounting System',
  description: 'View and analyze the trial balance for your accounting period.',
}

export default async function TrialBalancePage() {
  const initialData = await fetchTrialBalanceData()

  return <TrialBalanceContent initialData={initialData} />
}
