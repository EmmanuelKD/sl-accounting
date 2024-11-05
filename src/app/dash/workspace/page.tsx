"use client";

import {
  createWorkspaceAction,
  deleteWorkspaceAction,
  getAllWorkspacesAction,
  updateWorkspaceAction,
} from "@/lib/actions/workspace-actions";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import DeleteWorkspaceConfirmation from "@/components/client-components/workspace/deleteConfirm";
import WorkspaceDetail from "@/components/client-components/workspace/workspaceDetail";
import WorkspaceForm from "@/components/client-components/workspace/workspaceForm";
import { ERROR_MESSAGE } from "@/const";
import { HttpError } from "@/utils/errorHandler";
import { User, Workspace } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

type WorkspaceWithUsers = Workspace & { users: User[] };
export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceWithUsers[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceWithUsers | null>(
    null
  );
  const { data: session } = useSession();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    const res = await getAllWorkspacesAction();
    setWorkspaces(res.workspaces??[]);
  };

  const handlecreateWorkspace = async (
    workspace: Omit<
      Workspace & { users: User[] },
      "id" | "createdAt" | "updatedAt"
    >
  ) => {
  try {
    const user = session?.user;
    //Todo check if user is admin
    if (!user) {
      toast.error("Please login to create a workspace");
      return;
    } else {
      await createWorkspaceAction({
        name: workspace.name,
        description: workspace.name,
        users: workspace.users,
      });
      fetchWorkspaces();
      setIsFormOpen(false);
    }
       } catch (error) {
      console.error("Error creating workspace:", error);
      if (error instanceof HttpError) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGE);
      }
    }
  };

  const handleupdateWorkspace = async (workspace: Workspace) => {
    await updateWorkspaceAction(workspace.id, workspace);
    fetchWorkspaces();
    setIsDetailOpen(false);
  };

  const handledeleteWorkspace = async () => {
    if (selectedWorkspace) {
      await deleteWorkspaceAction(selectedWorkspace.id);
      fetchWorkspaces();
      setIsDeleteConfirmOpen(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mt: 4, mb: 2 }}
      >
        Workspaces
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsFormOpen(true)}
        sx={{ mb: 3 }}
      >
        Create Workspace
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Workspace Name</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Number of Users</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workspaces.map((workspace) => (
              <TableRow key={workspace.id}>
                <TableCell>{workspace.name}</TableCell>
                <TableCell>
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{workspace.users.length}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedWorkspace(workspace);
                      setIsDetailOpen(true);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedWorkspace(workspace);
                      setIsFormOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedWorkspace(workspace);
                      setIsDeleteConfirmOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <WorkspaceForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handlecreateWorkspace}
        workspace={selectedWorkspace}
      />
      <WorkspaceDetail
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        workspace={selectedWorkspace}
        onUpdate={handleupdateWorkspace}
      />
      <DeleteWorkspaceConfirmation
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handledeleteWorkspace}
      />
    </Container>
  );
}
