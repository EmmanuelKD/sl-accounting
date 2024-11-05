import {
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import { EmployeeWithRoleDepartmentAndSalary } from "./page";
import { paths } from "@/paths";
import { PictureAsPdf, Image, Visibility, GetApp } from "@mui/icons-material";
import { UploadFile } from "@prisma/client";

interface EmployeeProfileProps {
  employee: EmployeeWithRoleDepartmentAndSalary | null;
  open: boolean;
  onClose: () => void;
}

// Define a new component for the file card
function FileCardComponent({ file }: { file: UploadFile }) {
  const isImage =
    file.url.endsWith(".png") ||
    file.url.endsWith(".jpg") ||
    file.url.endsWith(".jpeg");
  const isPdf = file.url.endsWith(".pdf");
  // alert(file.url)
  return (
    <Paper
      sx={{
        py: 2,
        pt: 2,
        backgroundColor: (th) => th.palette.grey[800],
        maxWidth: 100,
      }}
    >
      <Stack alignItems="center" spacing={1}>
        <Typography variant="subtitle2" sx={{ color: "white" }}>
          {file.name}
        </Typography>
        {isImage && <Image   fontSize="large" sx={{ color: "white" }} />}
        {isPdf && <PictureAsPdf fontSize="large" sx={{ color: "white" }} />}
        <Stack direction="row" spacing={1} justifyContent="center">
          <IconButton
            onClick={() =>
              window.open(file.url.replace("public/", "/"), "_blank")
            }
            // sx={{ width: 15, height: 15 }}
            aria-label="preview"
          >
            <Visibility sx={{ width: 20, height: 20, color: "white" }} />
          </IconButton>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: "white", height: 20 }}
          />
          <IconButton
            onClick={() =>
              fetch(file.url.replace("public/", "/"))
                .then((response) => response.blob())
                .then((blob) => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = file.name;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                })
            }
            // sx={{ width: 15, height: 15 }}
            aria-label="download"
          >
            <GetApp sx={{ width: 20, height: 20, color: "white" }} />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function EmployeeProfile({
  employee,
  open,
  onClose,
}: EmployeeProfileProps) {
  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle position={"static"} >
        {employee.firstName} {employee.lastName}
      </DialogTitle>
      <Grid
        container 
        spacing={2}
        style={{ padding: 20 }}
        alignItems="flex-start"
 
      >
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Email" secondary={employee.email} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Phone" secondary={employee.phoneNumber} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Address" secondary={employee.address} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Date of Birth"
                secondary={new Date(employee.dateOfBirth).toLocaleDateString()}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Contact Person"
                secondary={employee.contactPersonName}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Contact Person Phone"
                secondary={employee.contactPersonPhone}
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Employment Details
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Job Title"
                secondary={employee.Role.title}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Department"
                secondary={employee.Department.name}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Hire Date"
                secondary={new Date(employee.startDate).toLocaleDateString()}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Status"
                secondary={employee.employmentStatus}
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12} md={4}>
          <Divider sx={{ my: 2 }} />
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <Typography variant="h6" gutterBottom>Compensation</Typography>
            <Button
              component={Link}
              href={`${paths.dashboard.hr.benefits_management}?uid=${employee.id}`}
              variant="text"
            >
              Manage
            </Button>
          </Stack>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Base Salary"
                secondary={`SLL ${(
                  employee?.salary?.basicSalary ?? 0
                ).toLocaleString()}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Bonus Eligibility"
                secondary={employee?.Benefit?.length > 0 ? "Yes" : "No"}
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Uploaded Files
          </Typography>
          <Grid container spacing={1}>
            {employee.UploadFile.length > 0 ? (
              employee.UploadFile.map((file, index) => (
                <Grid item xs={3} sm={2} key={index}>
                  <FileCardComponent file={file} />
                </Grid>
              ))
            ) : (
              <Typography>No files uploaded</Typography>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button onClick={onClose} color="primary">
              Close
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}
