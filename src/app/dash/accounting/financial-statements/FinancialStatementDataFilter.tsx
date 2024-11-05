'use client'

import { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Button, Grid } from '@mui/material'
import { useRouter } from 'next/navigation'
// import { paths } from '@/paths'

export default function DateFilter() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const router = useRouter()

  const handleFilter = () => {
    if (startDate && endDate) {
 
      // ${paths.dashboard.accounting.financial_statements.index}
      router.push(`/dash/accounting/financial-statements?start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
        <Grid item xs={12} sm={5}>
          <DatePicker
            label="From"
            value={startDate}
            onChange={(newValue: Date | null) => setStartDate(newValue)}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <DatePicker
            label="To"
            value={endDate}
            onChange={(newValue: Date | null) => setEndDate(newValue)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilter}
            fullWidth
            sx={{ height: '100%' }}
          >
            Filter
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  )
}