"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { paths } from "@/paths";
// import { paths } from '@/paths'

export default function FinancialStatementHeader() {
  const [statementType, setStatementType] = useState<string>("income");
  const router = useRouter();

  const handleStatementChange = (event: SelectChangeEvent<string>) => {
    setStatementType(event.target.value);

    router.replace(
      `${paths.dashboard.accounting.financial_statements.index}?type=${event.target.value}`
    );
  };

  const handleGenerateReport = () => {
    // Implement report generation logic here
    console.log("Generating report for:", statementType);
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1, textAlign: "center" }}>
          Financial Statements
        </Typography>
        <Select
          value={statementType}
          onChange={handleStatementChange}
          sx={{ mr: 2 }}
        >
          <MenuItem value="income">Income Statement</MenuItem>
          <MenuItem value="balance">Balance Sheet</MenuItem>
          <MenuItem value="cashflow">Cash Flow Statement</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
        >
          Generate Report
        </Button>
      </Toolbar>
    </AppBar>
  );
}
