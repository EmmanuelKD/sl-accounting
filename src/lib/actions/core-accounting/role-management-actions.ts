"use server";

import {
  createRole,
  getRoles,
  updateRole
} from "@/module/CoreAccountingModule";

// Role Management Actions

export async function createRoleAction(
  title: string,
  departmentId: string,
  workspaceId: string,
  level: number = 1
) {
  const role = await createRole(title, level, workspaceId, departmentId);
  return { role };
}


export async function updateRoleAction(
  id: string,
  title: string,
  departmentId: string
) {
  const role = await updateRole(id, title, departmentId);
  return { role };
}

export async function getRolesAction(workspaceId: string) {
  const roles = await getRoles(workspaceId);
  return { roles };
}
