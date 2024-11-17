"use server";
import { generatePayroll, getPayroll } from "@/module/CoreAccountingModule";
import { PaymentMode } from "@prisma/client";

export async function getPayrollAction(workspaceId: string, startDate?: Date, endDate?: Date, departmentId?: string) {
  return await getPayroll(workspaceId, startDate, endDate, departmentId);
}



export async function generatePayrollAction(workspaceId: string, payrollDate: Date, paymentMode: PaymentMode, excludedEmployees: string[]) {
  return await generatePayroll(workspaceId, payrollDate, paymentMode, excludedEmployees);
}


