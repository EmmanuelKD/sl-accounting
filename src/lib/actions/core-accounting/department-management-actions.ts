
"use server";


import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from "@/module/CoreAccountingModule";

// Department Management Actions

export async function createDepartmentAction(name: string, workspaceId: string, description?: string) {
  const department = await createDepartment(name, workspaceId, description);
  return { department };
}

export async function updateDepartmentAction(id: string, name: string, description?: string) {
  const department = await updateDepartment(id, name, description);
  return { department };
}

export async function deleteDepartmentAction(id: string) {
  const department = await deleteDepartment(id);
  return { department };
}

export async function getDepartmentsAction(workspaceId: string) {
  const departments = await getDepartments(workspaceId);
  return { departments };
}