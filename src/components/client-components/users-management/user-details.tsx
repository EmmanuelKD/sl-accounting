// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   Typography,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   Avatar,
// //   Box,
// // } from "@mui/material";
// // import { User, Workspace } from "@prisma/client";

// // type UserWithWorkspaces = User & { workspaces: Workspace[] };
// // interface UserDetailProps {
// //   open: boolean;
// //   onClose: () => void;
// //   user: (UserWithWorkspaces) | null;
// //   onUpdate: (user: UserWithWorkspaces) => void;
// // }

// // export default function UserDetail({
// //   open,
// //   onClose,
// //   user,
// //   onUpdate,
// // }: UserDetailProps) {
// //   if (!user) return null;

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
// //       <DialogTitle>{user.name}</DialogTitle>
// //       <DialogContent>
// //         <Box display="flex" alignItems="center" mb={2}>
// //           <Avatar
// //             src={user.imgUrl || undefined}
// //             alt={user.name}
// //             sx={{ width: 100, height: 100, mr: 2 }}
// //           />
// //           <Box>
// //             <Typography variant="body1">Email: {user.email}</Typography>
// //             <Typography variant="body1">Role: {user.role}</Typography>
// //           </Box>
// //         </Box>
// //         <Typography variant="h6" gutterBottom>
// //           Assigned Workspaces:
// //         </Typography>
// //         <List>
// //           {user.workspaces.map((workspace: Workspace) => (
// //             <ListItem key={workspace.id}>
// //               <ListItemText primary={workspace.name} />
// //             </ListItem>
// //           ))}
// //         </List>
// //       </DialogContent>
// //       <DialogActions>
// //         <Button onClick={onClose}>Close</Button>
// //         <Button
// //           onClick={() => onUpdate(user)}
// //           variant="contained"
// //           color="primary"
// //         >
// //           Edit
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // }

// 'use client'

// import { useState, useEffect } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Avatar,
//   Box,
//   Autocomplete,
//   TextField,
//   Chip,
// } from "@mui/material"
// import { User, Workspace } from "@prisma/client"
// import { getAllWorkspacesAction } from '@/lib/actions/workspace-actions'

// type UserWithWorkspaces = User & { workspaces: Workspace[] }

// interface UserDetailProps {
//   open: boolean
//   onClose: () => void
//   user: UserWithWorkspaces | null
//   onUpdate: (user: UserWithWorkspaces) => void
// }

// export default function UserDetail({
//   open,
//   onClose,
//   user,
//   onUpdate,
// }: UserDetailProps) {
//   const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([])
//   const [selectedWorkspaces, setSelectedWorkspaces] = useState<Workspace[]>([])

//   useEffect(() => {
//     if (open) {
//       fetchWorkspaces()
//     }
//   }, [open])

//   useEffect(() => {
//     if (user) {
//       setSelectedWorkspaces(user.workspaces)
//     }
//   }, [user])

//   const fetchWorkspaces = async () => {
//     const res = await getAllWorkspacesAction()
//     console.log(res.workspaces)
//     setAllWorkspaces(res.workspaces)
//   }

//   const handleWorkspaceChange = (event: React.SyntheticEvent, value: Workspace[]) => {
//     setSelectedWorkspaces(value)
//   }

//   const handleUpdate = () => {
//     if (user) {
//       const updatedUser: UserWithWorkspaces = {
//         ...user,
//         workspaces: selectedWorkspaces,
//       }
//       onUpdate(updatedUser)
//     }
//   }

//   if (!user) return null

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>{user.name}</DialogTitle>
//       <DialogContent>
//         <Box display="flex" alignItems="center" mb={2}>
//           <Avatar
//             src={user.imgUrl || undefined}
//             alt={user.name}
//             sx={{ width: 100, height: 100, mr: 2 }}
//           />
//           <Box>
//             <Typography variant="body1">Email: {user.email}</Typography>
//             <Typography variant="body1">Role: {user.role}</Typography>
//           </Box>
//         </Box>
//         <Typography variant="h6" gutterBottom>
//           Assigned Workspaces:
//         </Typography>
//         <Autocomplete
//           multiple
//           id="workspaces"
//           options={allWorkspaces}
//           getOptionLabel={(option) => option.name}
//           value={selectedWorkspaces}
//           onChange={handleWorkspaceChange}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               size="small"
//               variant="outlined"
//               label="Workspaces"
//               placeholder="Add workspaces"
//             />
//           )}
//           renderTags={(value: Workspace[], getTagProps) =>
//             value.map((option: Workspace, index: number) => (
//               <Chip
//                 variant="outlined"
//                 label={option.name}
//                 {...getTagProps({ index })}
//                 key={option.id}
//               />
//             ))
//           }
//         />
//         <List>
//           {selectedWorkspaces.map((workspace: Workspace) => (
//             <ListItem key={workspace.id}>
//               <ListItemText primary={workspace.name} />
//             </ListItem>
//           ))}
//         </List>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//         <Button
//           onClick={handleUpdate}
//           variant="contained"
//           color="primary"
//         >
//           Save Changes
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import { User, Workspace } from "@prisma/client";
import {
  getAllWorkspacesAction,
  removeUserFromWorkspaceAction,
} from "@/lib/actions/workspace-actions";
import { HttpError } from "@/utils/errorHandler";
import { ERROR_MESSAGE } from "@/const";
import toast from "react-hot-toast";

type UserWithWorkspaces = User & { workspaces: Workspace[] };

interface UserDetailProps {
  open: boolean;
  onClose: () => void;
  user: UserWithWorkspaces | null;
  onUpdate: (user: UserWithWorkspaces) => void;
}

export default function UserDetail({
  open,
  onClose,
  user,
  onUpdate,
}: UserDetailProps) {
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    if (open) {
      fetchWorkspaces();
    }
  }, [open]);

  useEffect(() => {
    if (user) {
      setSelectedWorkspaces(user.workspaces);
    }
  }, [user]);

  const fetchWorkspaces = async () => {
    const res = await getAllWorkspacesAction();
    setAllWorkspaces(res.workspaces);
  };

  const handleWorkspaceChange = (
    event: React.SyntheticEvent,
    value: Workspace[]
  ) => {
    setSelectedWorkspaces(value);
  };

  const handleRemoveWorkspace = async (workspaceToRemove: Workspace) => {
    try {
      if (user?.workspaces.includes(workspaceToRemove)) {
        await removeUserFromWorkspaceAction(
          workspaceToRemove.id,
          user?.id as string
        );
      }
      setSelectedWorkspaces(
        selectedWorkspaces.filter(
          (workspace) => workspace.id !== workspaceToRemove.id
        )
      );
    } catch (error) {
      if (error instanceof HttpError) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGE);
      }
    }
  };

  const handleUpdate = () => {
    if (user) {
      const updatedUser: UserWithWorkspaces = {
        ...user,
        workspaces: selectedWorkspaces,
      };
      onUpdate(updatedUser);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user.name}</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={user.imgUrl || undefined}
            alt={user.name}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Box>
            <Typography variant="body1">Email: {user.email}</Typography>
            <Typography variant="body1">Role: {user.role}</Typography>
          </Box>
        </Box>
        <Typography variant="h6" gutterBottom>
          Assigned Workspaces:
        </Typography>
        <Autocomplete
          multiple
          id="workspaces"
          size="small"
          options={allWorkspaces}
          getOptionLabel={(option) => option.name}
          value={selectedWorkspaces}
          onChange={handleWorkspaceChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Workspaces"
              placeholder="Add workspaces"
            />
          )}
          renderTags={(value: Workspace[], getTagProps) =>
            value.map((option: Workspace, index: number) => (
              <Chip
                variant="outlined"
                label={option.name}
                {...getTagProps({ index })}
                key={option.id}
              />
            ))
          }
        />
        <List>
          {selectedWorkspaces.map((workspace: Workspace) => (
            <ListItem key={workspace.id}>
              <ListItemText primary={workspace.name} />
              <Button
                onClick={() => handleRemoveWorkspace(workspace)}
                color="error"
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleUpdate} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
