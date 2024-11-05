"use client";


import {
    InfoOutlined,
    PictureAsPdf,
    Search,
    TableChart,
} from "@mui/icons-material";
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";
import { fetchTrialBalanceData, TrialBalanceEntry } from "./to-delete";

interface TrialBalanceContentProps {
  initialData: TrialBalanceEntry[];
}

export default function TrialBalanceContent({
  initialData,
}: TrialBalanceContentProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState<TrialBalanceEntry[]>(initialData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] =
    useState<keyof TrialBalanceEntry>("accountName");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property: keyof TrialBalanceEntry) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const newData = await fetchTrialBalanceData(startDate, endDate);
      setData(newData);
    } catch (err) {
      setError("Failed to fetch trial balance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type: "pdf" | "excel") => {
    // Implement export functionality
    console.log(`Exporting as ${type}`);
  };

  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, order, orderBy]);

  const totalDebits = data.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = data.reduce((sum, entry) => sum + entry.credit, 0);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Trial Balance
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PictureAsPdf />}
                onClick={() => handleExport("pdf")}
                sx={{ mr: 1 }}
              >
                Export PDF
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<TableChart />}
                onClick={() => handleExport("excel")}
              >
                Export Excel
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
              }}
            >
              <DatePicker
                label="From"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="To"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<Search />}
                onClick={handleSearch}
                disabled={loading}
              >
                Search
              </Button>
            </Paper>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "error.light",
                  color: "error.contrastText",
                }}
              >
                <Typography>{error}</Typography>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                bgcolor: "warning.light",
                // color: "primary",
              }}
            >
              <Typography variant="h6">Total Debits</Typography>
              <Typography variant="h4">${totalDebits.toFixed(2)}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                bgcolor: "success.light",
                color: "secondary.contrastText",
              }}
            >
              <Typography variant="h6">Total Credits</Typography>
              <Typography variant="h4">${totalCredits.toFixed(2)}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "accountName"}
                        direction={orderBy === "accountName" ? order : "asc"}
                        onClick={() => handleSort("accountName")}
                      >
                        Account Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "accountNumber"}
                        direction={orderBy === "accountNumber" ? order : "asc"}
                        onClick={() => handleSort("accountNumber")}
                      >
                        Account Number
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === "debit"}
                        direction={orderBy === "debit" ? order : "asc"}
                        onClick={() => handleSort("debit")}
                      >
                        Debit
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === "credit"}
                        direction={orderBy === "credit" ? order : "asc"}
                        onClick={() => handleSort("credit")}
                      >
                        Credit
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === "balance"}
                        direction={orderBy === "balance" ? order : "asc"}
                        onClick={() => handleSort("balance")}
                      >
                        Balance
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((entry) => (
                      <TableRow key={entry.accountNumber}>
                        <TableCell>{entry.accountName}</TableCell>
                        <TableCell>{entry.accountNumber}</TableCell>
                        <TableCell align="right">
                          ${entry.debit.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          ${entry.credit.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          ${entry.balance.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  {sortedData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          p={2}
                        >
                          <InfoOutlined sx={{ mr: 1 }} />
                          <Typography>
                            No data available for the selected date range
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={sortedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}
