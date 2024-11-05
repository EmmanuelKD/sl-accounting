"use client";
import { ChevronLeft, ChevronRight, Search } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { debounce } from 'lodash';
// import dayjs from "dayjs";
import { getJournalEntriesAction } from "@/lib/actions/core-accounting/journal-entry-action";
import { paths } from "@/paths";
import { JournalEntry, Transaction } from "@prisma/client";
import dayjs from "dayjs";

interface AccountingPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

// Add this placeholder data for accounting periods
const accountingPeriods: AccountingPeriod[] = [
  {
    id: "1",
    name: "Annual 2023",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
  },
  // Add more periods as needed
];
type TransactionWithAccountAndUser = Transaction & {
  account: { name: string; id: string };
};

type JournalEntryWithTransactions = JournalEntry & {
  transactions: TransactionWithAccountAndUser[];
  createdByUser: { name: string; id: string };
};
export default function GeneralLedger() {
  const [selectedEntry, setSelectedEntry] =
    useState<JournalEntryWithTransactions | null>(null);
  const [journalEntries, setJournalEntries] = useState<
    JournalEntryWithTransactions[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleDateChange = (newDate?: dayjs.Dayjs) => {
    setDateFilter(newDate ? newDate.toDate() : undefined);
    setCurrentPage(1);
  };

  const handlePeriodChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPeriod(e.target.value as string);
    setCurrentPage(1);
  };

  const calculateTotals = (transactions: Transaction[]) => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "DEBIT") {
          acc.debitTotal += transaction.amount;
        } else if (transaction.type === "CREDIT") {
          acc.creditTotal += transaction.amount;
        }
        return acc;
      },
      { debitTotal: 0, creditTotal: 0 }
    );
  };

  interface GroupedTransactions {
    debit?: TransactionWithAccountAndUser;
    credit?: TransactionWithAccountAndUser;
    [key: string]: TransactionWithAccountAndUser | undefined;
  }

  function groupTransactionsByRelatedTransaction(
    transactions: TransactionWithAccountAndUser[]
  ) {
    const groupedTransactions: Record<string, GroupedTransactions> = {};

    // Step 1: Create a lookup map of transactions by their ID
    const transactionMap: Record<string, TransactionWithAccountAndUser> = {};
    transactions.forEach((transaction) => {
      transactionMap[transaction.id] = transaction;
    });

    // Step 2: Loop through the transactions and group them by their relationship
    transactions.forEach((transaction) => {
      const relatedId = transaction.relatedTransactionId;

      if (relatedId && transactionMap[relatedId]) {
        // Ensure the related transaction exists in the map
        if (!groupedTransactions[relatedId]) {
          groupedTransactions[relatedId] = {};
        }

        if (transaction.type === "DEBIT") {
          groupedTransactions[relatedId].debit = transaction;
        } else if (transaction.type === "CREDIT") {
          groupedTransactions[relatedId].credit = transaction;
        }

        // Also group the related transaction, making sure both are linked
        const relatedTransaction = transactionMap[relatedId];
        if (relatedTransaction.type === "DEBIT") {
          groupedTransactions[relatedId].debit = relatedTransaction;
        } else if (relatedTransaction.type === "CREDIT") {
          groupedTransactions[relatedId].credit = relatedTransaction;
        }
      } else {
        // If no relatedTransactionId, treat the transaction as standalone
        if (!groupedTransactions[transaction.id]) {
          groupedTransactions[transaction.id] = {};
        }
        groupedTransactions[transaction.id][transaction.type.toLowerCase()] =
          transaction;
      }
    });

    // Convert the grouped transactions into an array
    const result = Object.values(groupedTransactions);
    return result;
  }

  const handleEntriesPerPageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setEntriesPerPage(event.target.value as number);
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

  const fetchJournalEntries = async () => {
    const workspaceId = "cm2el4sot0002nhcysia1pnfu";
    setLoading(true);
    try {
      const { journalEntries: fetchedEntries, totalCount: tableEntriesCount } =
        await getJournalEntriesAction({
          page: currentPage,
          limit: entriesPerPage,
          workspaceId,
          periodId: selectedPeriod,
          entryDate: dateFilter,
          searchQuery: debouncedSearchTerm, // Use the debounced search term
        });
      setJournalEntries(fetchedEntries);
      const totalPages = Math.ceil(tableEntriesCount / entriesPerPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJournalEntries();
  }, [currentPage, debouncedSearchTerm, dateFilter, selectedPeriod, entriesPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, dateFilter, selectedPeriod, entriesPerPage]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg">
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h4" style={{ flexGrow: 1 }}>
              General Ledger
            </Typography>
            <Button
              color="inherit"
              LinkComponent={Link}
              href={
                paths.dashboard.accounting.general_ledger.journal_entries.index
              }
            >
              Add Journal Entry
            </Button>
            <Button
              color="inherit"
              LinkComponent={Link}
              href={paths.dashboard.accounting.general_ledger.trial_balance}
            >
              View Trial Balance
            </Button>
            <Button
              color="inherit"
              LinkComponent={Link}
              href={paths.dashboard.accounting.general_ledger.chart_of_accounts}
            >
              Chart of Accounts
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          my={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <Search color="action" />,
              }}
            />
            <Box ml={2}>
              <DatePicker
                label="Filter by date"
                value={dateFilter ? dayjs(dateFilter) : null}
                onChange={handleDateChange}
                renderInput={(params: any) => (
                  <TextField {...params} size="small" />
                )}
              />
            </Box>
            <Box ml={2}>
              <FormControl size="small" style={{ minWidth: 200 }}>
                <InputLabel id="accounting-period-label">
                  Accounting Period
                </InputLabel>
                <Select
                  labelId="accounting-period-label"
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  label="Accounting Period"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {accountingPeriods.map((period) => (
                    <MenuItem key={period.id} value={period.id}>
                      {period.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </IconButton>
            <Typography variant="body2">
              Page {currentPage} of {totalPages}
            </Typography>
            <IconButton
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Debit Total</TableCell>
                  <TableCell>Credit Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {journalEntries.map((entry) => {
                  const { debitTotal, creditTotal } = calculateTotals(
                    entry.transactions
                  );
                  return (
                    <TableRow
                      key={entry.id}
                      hover
                      onClick={() => setSelectedEntry(entry)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>{entry.date.toLocaleDateString()}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{entry.createdByUser.name}</TableCell>
                      <TableCell>SLL {debitTotal.toFixed(2)}</TableCell>
                      <TableCell>SLL {creditTotal.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
          <Select
            value={entriesPerPage}
            onChange={handleEntriesPerPageChange}
            variant="outlined"
            size="small"
          >
            <MenuItem value={10}>10 per page</MenuItem>
            <MenuItem value={25}>25 per page</MenuItem>
            <MenuItem value={50}>50 per page</MenuItem>
          </Select>
        </Box>

        <Dialog
          open={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{selectedEntry?.description}</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" gutterBottom>
              Date: {selectedEntry?.date.toLocaleDateString()} | Created by:{" "}
              {selectedEntry?.createdByUser.name}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Account</TableCell>
                    <TableCell>Debit</TableCell>
                    <TableCell>Credit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupTransactionsByRelatedTransaction(
                    selectedEntry?.transactions ?? []
                  ).map((transaction, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Divider textAlign="right">
                            <Typography variant="caption" color="primary">
                              Transaction {index + 1}
                            </Typography>
                          </Divider>
                        </TableCell>
                      </TableRow>
                      <TableRow key={index}>
                        <TableCell>{transaction.debit?.account.name}</TableCell>
                        <TableCell>SLL {transaction.debit?.amount}</TableCell>
                        <TableCell>SLL {0}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {transaction.credit?.account.name}
                        </TableCell>
                        <TableCell>SLL {0}</TableCell>
                        <TableCell>SLL {transaction.credit?.amount}</TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedEntry(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
}
