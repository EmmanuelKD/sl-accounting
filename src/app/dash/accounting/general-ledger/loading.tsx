import {
    Box,
    Container,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@mui/material";
  
  export default function GeneralLedgerLoading() {
    return (
      <Container maxWidth="lg">
        {/* Toolbar skeleton */}
        <Box height={64} mb={4}>
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </Box>
  
        {/* Search and filters skeleton */}
        <Box
          my={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" gap={2}>
            <Skeleton variant="rectangular" width={200} height={40} />
            <Skeleton variant="rectangular" width={200} height={40} />
            <Skeleton variant="rectangular" width={200} height={40} />
          </Box>
          <Skeleton variant="rectangular" width={120} height={40} />
        </Box>
  
        {/* Table skeleton */}
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
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Pagination skeleton */}
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Skeleton variant="rectangular" width={300} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </Box>
      </Container>
    );
  }