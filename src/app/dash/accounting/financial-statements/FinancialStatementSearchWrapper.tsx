'use client'

import { useSearchParams } from 'next/navigation'
import FinancialStatementContent from './FinancialStatementContentPage'
 
export default function FinancialStatementWrapper() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'income'
  const start = searchParams.get('start') || new Date().toISOString()
  const end = searchParams.get('end') || new Date().toISOString()

  return <FinancialStatementContent type={type} start={start} end={end} />
}