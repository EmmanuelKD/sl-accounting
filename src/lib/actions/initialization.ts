"use server";
import { createDefaultAccounts } from "@/module/CoreAccountingModule";
import { createWorkspace } from "@/module/WorkspaceModule";
import { UserRole } from "@prisma/client";
import UserManagementModule, { registerUser } from "@/module/UserManagementModule";
import { v4 as uuidv4 } from "uuid";
import { saveImageLocally } from "@/utils/files";
import { prisma } from "@/db";

export async function initApp({
  workspaceName,
  // percentageLoader,
  defaultAdmin,
}: {
  workspaceName: string;
  defaultAdmin: {
    profile: FormData;
    email: string;
    name: string;
    password: string;
  };
  // percentageLoader: (p: number, d: string) => void;
}) {
  // create workspace
  // percentageLoader(0, "Creating workspace...");

  const { workspace } = await createWorkspace({
    name: workspaceName,
    users: [],
  });

  //create user
  // percentageLoader(20, "Creating default admin...");
   const id = uuidv4();
  const imgUrl = await saveImageLocally(defaultAdmin.profile, id);

  await registerUser(
    {
      email: defaultAdmin.email,
      password: defaultAdmin.password,
      role: UserRole.ADMIN,
      imgUrl,
      name: defaultAdmin.name,
      id,
    },
    [workspace]
  );

  //create default accounts
  // percentageLoader(50, "Creating default admin...");

  await createDefaultAccounts(workspace.id);
}

export async function setupWizard() {
  // create tax brackets
  // create deductions
  // create benefits
}

export async function checkIfAppIsInitializedAction() {
  try {
    const workspace = await prisma.workspace.findFirst();
    return !!workspace;
  } catch (error) {
    // If table doesn't exist, app is not initialized
    if (error instanceof Error && error.message.includes('does not exist')) {
      return false;
    }
    // Re-throw other errors
    throw error;
  }
}

export async function checkIfDBconnected() {
  try {
    await prisma.workspace.count();
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}


