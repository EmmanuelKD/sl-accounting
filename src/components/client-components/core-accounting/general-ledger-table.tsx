'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { TextField, Button, Typography, Box } from '@mui/material'
import { debounce } from 'lodash'
 
interface Transaction {
  id: number
  date: string
  description: string
  account: string
  debit: number
  credit: number
  balance: number
}

interface TransactionResponse {
  transactions: Transaction[]
  totalCount: number
}

interface FetchParams {
  page: number
  limit: number
  workspaceId: string
  startDate: Date | null
  endDate: Date | null
  transactionDate: Date | null
  searchQuery: string
}

// Mock function for getAllTransactionsAction
async function getAllTransactionsAction(params: FetchParams): Promise<TransactionResponse> {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    transactions: [
      { id: 1, date: '2023-01-01', description: 'Sample Transaction', account: 'Cash', debit: 100, credit: 0, balance: 100 },
      { id: 2, date: '2023-01-02', description: 'Another Transaction', account: 'Revenue', debit: 0, credit: 200, balance: -100 },
      { id: 3, date: '2023-01-03', description: 'Third Transaction', account: 'Expenses', debit: 50, credit: 0, balance: -50 },
    ],
    totalCount: 100
  }
}

const columns: GridColDef[] = [
  { field: 'date', headerName: 'Date', width: 130 },
  { field: 'description', headerName: 'Description', width: 200 },
  { field: 'account', headerName: 'Account', width: 150 },
  { field: 'debit', headerName: 'Debit', width: 100, type: 'number' },
  { field: 'credit', headerName: 'Credit', width: 100, type: 'number' },
  { field: 'balance', headerName: 'Balance', width: 100, type: 'number' },
].map(col => ({
  ...col,
  renderCell: (params) => (
    <div
      style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
      onClick={() => setSelectedEntry(params.row)}
    >
      {params.value}
    </div>
  ),
}));

export default function GeneralLedgerTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [transactionDate, setTransactionDate] = useState<Date | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedEntry, setSelectedEntry] = useState<Transaction | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllTransactionsAction({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
        workspaceId: 'mock-workspace-id',
        startDate,
        endDate,
        transactionDate,
        searchQuery,
      })
      setTransactions(data.transactions)
      setTotalCount(data.totalCount)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false)
    }
  }, [paginationModel, startDate, endDate, transactionDate, searchQuery])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const debouncedSearch = debounce(() => {
    fetchData()
  }, 300)

  useEffect(() => {
    debouncedSearch()
    return debouncedSearch.cancel
  }, [searchQuery, debouncedSearch])

  const handleResetFilters = () => {
    setStartDate(null)
    setEndDate(null)
    setTransactionDate(null)
    setSearchQuery('')
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          General Ledger
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue: Date | null) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue: Date | null) => setEndDate(newValue)}
          />
          <DatePicker
            label="Transaction Date"
            value={transactionDate}
            onChange={(newValue: Date | null) => setTransactionDate(newValue)}
          />
          <TextField
            label="Search Transactions"
            variant="outlined"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button variant="outlined" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </Box>
        <DataGrid
          rows={transactions}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          rowCount={totalCount}
          loading={loading}
          paginationMode="server"
          disableRowSelectionOnClick
          autoHeight
        />
        <TransactionDialog
          selectedEntry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      </Box>
    </LocalizationProvider>
  )
}