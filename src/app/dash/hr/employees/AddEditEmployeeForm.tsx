import { getDepartmentsAction } from "@/lib/actions/core-accounting/department-management-actions";
import { saveStaffFile } from "@/utils/files";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  Department,
  Employee,
  MaritalStatus,
  Role,
  UploadFile,
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { EmployeeWithRoleDepartmentAndSalary } from "./page";

interface AddEditEmployeeFormProps {
  open: boolean;
  onClose: () => void;
  employee: EmployeeWithRoleDepartmentAndSalary;
  onSave: (employee: EmployeeWithRoleDepartmentAndSalary) => void;
}

// export type EmployeeWithRoleDepartmentAndSalary = Employee & {
//   roleId: string;
//   departmentId: string;
//   basicSalary: number;
//   uploadedFiles: UploadFile[];
// };
type DepartmentWithRoles = Department & {
  Role: Role[];
};

export default function AddEditEmployeeForm({
  open,
  onClose,
  employee,
  onSave,
}: AddEditEmployeeFormProps) {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleId: "",
    departmentId: "",
    basicSalary: 0,
    dateOfBirth: new Date(),
    startDate: new Date(),
    address: "",
    contactPersonName: "",
    contactPersonPhone: "",
  };
  const [formData, setFormData] =
    useState<Partial<EmployeeWithRoleDepartmentAndSalary>>(initialState);

  const [departments, setDepartments] = useState<DepartmentWithRoles[]>([]);
  const [selectedDepartmentRoles, setSelectedDepartmentRoles] = useState<
    Role[]
  >([]);

  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData(initialState);
    }
  }, [employee]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name === "roleId") {
      setFormData((prev) => ({ ...prev, roleId: value as string }));
    } else if (name === "departmentId") {
      setSelectedDepartmentRoles(
        departments.find((d) => d.id === value)?.Role || []
      );
      setFormData((prev) => ({ ...prev, departmentId: value as string }));
    } else {
      setFormData((prev) => ({ ...prev, [name as string]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      setFileNames(selectedFiles.map((file) => file.name));
    }
  };

  const handleFileNameChange = (index: number, newName: string) => {
    const updatedFileNames = [...fileNames];
    updatedFileNames[index] = newName;
    setFileNames(updatedFileNames);
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedFileNames = fileNames.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setFileNames(updatedFileNames);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileUploadPromises = files.map((file, index) => {
       const formData = new FormData();
      formData.append("file", file);
      return {
        file: formData,
        fileName: fileNames[index],
      } 
    });

    const uploadedFiles = await Promise.all(fileUploadPromises);
    onSave({
      ...formData,

      uploadedFiles: uploadedFiles,
    } as EmployeeWithRoleDepartmentAndSalary);
  };

  async function init() {
    const workspaceId = "cm2el4sot0002nhcysia1pnfu";
    const response = await getDepartmentsAction(workspaceId);
    setDepartments(response.departments);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {employee ? "Edit Employee" : "Add New Employee"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name (Surname)"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="departmentId"
                  value={formData.departmentId || ""}
                  onChange={handleChange}
                  label="Department"
                >
                  {departments.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="roleId"
                  value={formData.roleId || ""}
                  onChange={handleChange}
                  label="Role"
                >
                  {selectedDepartmentRoles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Basic Salary"
                name="basicSalary"
                type="number"
                value={formData.basicSalary}
                onChange={handleChange}
                InputProps={{ startAdornment: "SLL" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Hire Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="NASSIT Number"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="NRA Tin Number"
                name="NRA_Tin_Number"
                value={formData.NRA_Tin_Number}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="NIN"
                name="NIN_Number"
                value={formData.NIN_Number}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  name="maritalStatus"
                  value={formData.maritalStatus || "SINGLE"}
                  onChange={handleChange}
                  label="Marital Status"
                >
                  <MenuItem value={MaritalStatus.SINGLE}>Single</MenuItem>
                  <MenuItem value={MaritalStatus.MARRIED}>Married</MenuItem>
                  <MenuItem value={MaritalStatus.DIVORCED}>Divorced</MenuItem>
                  <MenuItem value={MaritalStatus.WIDOWED}>Widowed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Contact Person Name"
                name="contactPersonName"
                value={formData.contactPersonName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Contact Person Phone"
                name="contactPersonPhone"
                value={formData.contactPersonPhone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                multiple
                accept=".pdf,image/*"
                onChange={handleFileChange}
              />
            </Grid>
            {files.map((file, index) => (
              <Grid
                container
                item
                xs={8}
                key={index}
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteFile(index)}
                  >
                    Delete
                  </Button>
                </Grid>
                <Grid item xs>
                  <TextField
                    required
                    type="text"
                    fullWidth
                    value={fileNames[index]}
                    onChange={(e) =>
                      handleFileNameChange(index, e.target.value)
                    }
                    placeholder="Enter file name"
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {employee ? "Save Changes" : "Add Employee"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// Function to handle file upload
// async function uploadFile(
//   file: File,
//   employeeId: string,
//   fileName: string,
//   workspaceId: string
// ) {
  // const formData = new FormData();
  // formData.append("file", file);
//   return saveStaffFile(formData, fileName, employeeId, workspaceId);
// }
