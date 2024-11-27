import { prisma } from "@/db";
import { HttpError } from "@/utils/errorHandler";
import { User } from "@prisma/client";

// Create a new workspace
export async function createWorkspace(data: { name: string; users: User[] }) {
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        ...(data.users && {
          users: {
            connect: data.users.map((users) => ({ id: users.id })), // Connect existing user to the workspace
          },
        }),
      },
    });

    return { workspace };
  } catch (error) {
    console.error("Error creating workspace:", error);
    throw new HttpError({
      code: 500,
      success: false,
      message: "Error creating workspace",
      error: error,
    });
  }
}

// Get all workspace
export async function getAllWorkspaces() {
  try {
    const workspaces = await prisma.workspace.findMany({
      include: {
        users: true, // Include user data
      },
    });
    return { workspaces };
  } catch (error) {
    console.error("Error fetching workspace:", error);
    throw new HttpError({
      code: 500,
      success: false,
      message: "Error fetching workspace",
      error: error,
    });
  }
}

export async function addUserToMultipleWorkspaces(
  userId: string,
  workspaceIds: string[]
) {
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpError({
        code: 404,
        success: false,
        message: "User not found",
      });
    }

    // Check if all workspaces exist
    const workspaces = await prisma.workspace.findMany({
      where: { id: { in: workspaceIds } },
    });

    if (workspaces.length !== workspaceIds.length) {
      throw new HttpError({
        code: 404,
        success: false,
        message: "One or more workspaces not found",
      });
    }

    // Add user to multiple workspaces
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        workspaces: {
          connect: workspaceIds.map((id) => ({ id })),
        },
      },
      include: { workspaces: true },
    });

    return { user: updatedUser };
  } catch (error) {
    console.error("Error adding user to multiple workspaces:", error);

    throw new HttpError({
      code: 500,
      success: false,
      message: "Error adding user to multiple workspaces",
      error: error,
    });
  }
}

// Add user to workspace
export async function addUserToWorkspace(workspaceId: string, userId: string) {
  try {
    // Check if the workspace exists
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { users: true },
    });

    if (!workspace) {
      throw new HttpError({
        code: 404,
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if the user is in the workspace
    if (!workspace.users.some((user) => user.id === userId)) {
      throw new HttpError({
        code: 400,
        success: false,
        message: "User is not in this workspace",
      });
    }

    // Remove the user from the workspace
    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
      include: { users: true },
    });

    return { workspace: updatedWorkspace };
  } catch (error) {
    throw new HttpError({
      code: 500,
      success: false,
      message: "Error removing user from workspace",
      error: error,
    });
  }
}

// Remove user from workspace
export async function removeUserFromWorkspace(
  workspaceId: string,
  userId: string
) {
  try {
    // Check if the workspace exists
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { users: true },
    });

    if (!workspace) {
      throw new HttpError({
        code: 404,
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if the user is in the workspace
    if (!workspace.users.some((user) => user.id === userId)) {
      throw new HttpError({
        code: 400,
        success: false,
        message: "User is not in this workspace",
      });
    }

    // Remove the user from the workspace
    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
      include: { users: true },
    });

    return { workspace: updatedWorkspace };
  } catch (error) {
    throw new HttpError({
      code: 500,
      success: false,
      message: "Error removing user from workspace",
      error: error,
    });
  }
}

// Get workspace by ID
export async function getWorkspaceById(workspaceId: string) {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        users: true, // Include user data
      },
    });
    return { workspace };
  } catch (error) {
    console.error("Error fetching workspace:", error);
    throw new HttpError({
      code: 500,
      success: false,
      message: "Error fetching workspace",
      error: error,
    });
  }
}

// Update workspace details
export async function updateWorkspace(
  workspaceId: string,
  data: { name?: string }
) {
  try {
    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        name: data.name,
      },
    });
    return { workspace };
  } catch (error) {
    console.error("Error updating workspace:", error);
    throw new HttpError({
      code: 500,
      success: false,
      message: "Error updating workspace",
      error: error,
    });
  }
}

// Delete a workspace
export async function deleteWorkspace(workspaceId: string) {
  try {
    const deletedWorkspace = await prisma.workspace.delete({
      where: { id: workspaceId },
    });
    return { workspace: deletedWorkspace };
  } catch (error) {
    console.error("Error deleting workspace:", error);
    throw new HttpError({
      code: 500,
      success: false,
      message: "Error deleting workspace",
      error: error,
    });
  }
}
