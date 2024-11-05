"use server";
import {
  assignEmployeeBenefit,
  assignEmployeeDeduction,
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  recalculateEmployeeSalary,
  removeEmployeeBenefit,
  removeEmployeeDeduction,
  updateEmployee,
  uploadEmployeeFiles,
} from "@/module/CoreAccountingModule";
import { saveStaffFile } from "@/utils/files";
import {
  Benefit,
  Deduction,
  Employee,
  EmploymentStatus,
  MaritalStatus
} from "@prisma/client";

// create Employee action
export async function createEmployeeAction(data: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  baseSalary: number;
  departmentId: string;
  roleId: string;
  startDate: Date;
  workspaceId: string;
  dateOfBirth: Date;
  employmentStatus: EmploymentStatus;
  maritalStatus: MaritalStatus;
  contactPersonName: string;
  contactPersonPhone: string;
  NRA_Tin_Number?: string;
  NIN_Number?: string;
  uploadedFiles: {
    file: FormData;
    fileName: string;
  }[];
}) {
  const employee = await createEmployee(data);
  // upload files
  const uploadFiles = await Promise.all(
    data.uploadedFiles.map(async (file) => {
      return await saveStaffFile(
        file.file,
        file.fileName,
        employee.id,
        data.workspaceId
      );
    })
  );
  await uploadEmployeeFiles(uploadFiles);
  return { employee };
}

export async function recalculateEmployeeSalaryAction(id: string) {
  const salary = await recalculateEmployeeSalary(id);
  return { salary };
}
// get Employees action
export async function getEmployeesAction(workspaceId: string) {
  const employees = await getAllEmployees(workspaceId);
  return { employees };
}
// get an employee action
export async function getEmployeeAction(id: string) {
  const employee = await getEmployee(id);
  return { employee };
}
// delete Employee action
export async function deleteEmployeeAction(id: string) {
  const employee = await deleteEmployee(id);
  return { employee };
}

// update Employee action
export async function updateEmployeeAction(employee: Employee) {
  const updatedEmployee = await updateEmployee(employee.id, employee);
  return { updatedEmployee };
}

export async function assignEmployeeBenefitAction(data:Omit<Benefit,"id">) {
  const assignedBenefit = await assignEmployeeBenefit(data);
  return { assignedBenefit };
}


export async function removeEmployeeBenefitAction(benefitId: string) {
  const removedBenefit = await removeEmployeeBenefit(benefitId);
  return { removedBenefit };
}

export async function assignEmployeeDeductionAction(data: Omit<Deduction, "id">) {
  const assignedDeduction = await assignEmployeeDeduction(data);
  return { assignedDeduction };
}

export async function removeEmployeeDeductionAction(deductionId: string) {
  const removedDeduction = await removeEmployeeDeduction(deductionId);
  return { removedDeduction };
}
