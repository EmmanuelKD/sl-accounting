"use client";

import { Box, Container, Typography } from "@mui/material";
import DepartmentManagementPage from "./DepartmentManagement";
import RoleManagement from "./RoleManagement";
import { Department, Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { getRolesAction } from "@/lib/actions/core-accounting/role-management-actions";
import { getDepartmentsAction } from "@/lib/actions/core-accounting/department-management-actions";

// const departments = ["Engineering", "HR", "Finance", "Marketing", "Sales"];
export type RoleWithDepartment = Role & {
  department: { id: string; name: string };
};

export default function RoleSalaryManagementPage() {
  const [roles, setRoles] = useState<RoleWithDepartment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  async function init() {
    const workspaceId = "cm2el4sot0002nhcysia1pnfu";
    const [fetchedRoles, fetchedDepartments] = await Promise.all([
      getRolesAction(workspaceId),
      getDepartmentsAction(workspaceId),
    ]);
    setRoles(fetchedRoles.roles as RoleWithDepartment[]);
    setDepartments(fetchedDepartments.departments);
  }

  useEffect(() => {
    init();
  }, []);
  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="left">
          Department and Role Management
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <DepartmentManagementPage paramsDepartments={departments} />
      </Box>
      <Box>
        <RoleManagement paramsRoles={roles} departments={departments} />
      </Box>
    </Container>
  );
}
