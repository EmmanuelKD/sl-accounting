"use client";

import StaffCard from "@/components/client-components/hr/StaffCard";
import { getEmployeeAction } from "@/lib/actions/core-accounting/hr-actions";
import { Container, Grid, Paper } from "@mui/material";
import {
  Benefit,
  BenefitHistory,
  Deduction,
  Employee,
  Salary,
  SalaryHistory,
} from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BenefitDetails from "./components/BenefitDetails";
import SalaryDetails from "./components/SalaryDetails";
import DeductionDetails from "./components/DeductionDetails";

export type EmployeeSalaryHistoryWithBenefitHistory = Employee & {
  SalaryHistory: SalaryHistory[];
  BenefitHistory: BenefitHistory[];
  salary: Salary;
  Benefit: Benefit[];
  Deduction: Deduction[];
};

export default function SalaryBenefitsPage() {
  const param = useSearchParams();
  const uid = param.get("uid");
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeSalaryHistoryWithBenefitHistory | null>(null);
  const workspaceId = "cm2el4sot0002nhcysia1pnfu";
  const fetchEmployees = async () => {
    try {
      const req = await getEmployeeAction(uid as string);
      setSelectedEmployee(req.employee as any);
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, [uid]);
  if (selectedEmployee) {
    // const sumBennifit = selectedEmployee.Benefit.filter(()=>fi).reduce(
    //   (acc, curr) => acc + curr.value,
    //   0
    // );
    // selectedEmployee.salary.deductions = sumBennifit;
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {selectedEmployee && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StaffCard staff={selectedEmployee as any} />
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <SalaryDetails
                    salary={selectedEmployee.salary}
                    salaryHistory={selectedEmployee.SalaryHistory}
                    reloadEmployeeDetails={fetchEmployees}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <BenefitDetails
                    employeeId={selectedEmployee.id}
                    benefits={selectedEmployee.Benefit}
                    reloadEmployeeDetails={fetchEmployees}
                    workspaceId={workspaceId}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <DeductionDetails
                    employeeId={selectedEmployee.id}
                    deductions={selectedEmployee.Deduction}
                    reloadEmployeeDetails={fetchEmployees}
                    workspaceId={workspaceId}
                  />
                </Paper>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
