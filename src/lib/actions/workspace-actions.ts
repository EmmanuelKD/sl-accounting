"use server";

import {
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getAllWorkspaces,
  removeUserFromWorkspace,
  addUserToWorkspace,
  addUserToMultipleWorkspaces,
} from "@/module/WorkspaceModule"; // Adjust the import path as needed
import { User } from "@prisma/client";

// Server action to create a workspace
export async function createWorkspaceAction(data: {
  name: string;
  description?: string;
  users: User[];
}) {
  const res = await createWorkspace(data);
  return res;
}

// Server action to get workspace by ID
export async function getWorkspaceByIdAction(workspaceId: string) {
  const res = await getWorkspaceById(workspaceId);
  return res;
}

// Server action to get all workspaces
export async function getAllWorkspacesAction() {
  const res = await getAllWorkspaces();
  return res;
}

// Server action to remove user from workspace
export async function removeUserFromWorkspaceAction(
  workspaceId: string,
  userId: string
) {
  const res = await removeUserFromWorkspace(workspaceId, userId);
  return res;
}
export async function addUserToWorkspacesAction(
  workspaceId: string,
  userId: string
) {
  const res = await addUserToWorkspace(workspaceId, userId);
  return res;
}

export async function addUserToMultipleWorkspacesAction(
  workspaceId: string[],
  userId: string
) {
  const res = await addUserToMultipleWorkspaces(userId, workspaceId);
  return res;
}

// Server action to update a workspace
export async function updateWorkspaceAction(
  workspaceId: string,
  data: { name?: string; description?: string }
) {
  const res = await updateWorkspace(workspaceId, data);
  return res;
}

// Server action to delete a workspace
export async function deleteWorkspaceAction(workspaceId: string) {
  const res = await deleteWorkspace(workspaceId);
  return res;
}

