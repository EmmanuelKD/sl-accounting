import { Suspense } from 'react'
   import { Typography, Container, Paper } from '@mui/material'
import FinancialStatementHeader from '../FinancialStatementHeader'
import DateFilter from '../FinancialStatementDataFilter'
import ErrorBoundary from '../ErrorBoundry'
import FinancialStatementWrapper from '../FinancialStatementSearchWrapper'
 
export default function FinancialStatementsPage() {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <FinancialStatementHeader />
        <DateFilter />
        <ErrorBoundary>
          <Suspense fallback={<Typography>Loading...</Typography>}>
            <FinancialStatementWrapper />
          </Suspense>
        </ErrorBoundary>
      </Paper>
    </Container>
  )
}