import { recalculateEmployeeSalaryAction } from "@/lib/actions/core-accounting/hr-actions";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Person } from "@mui/icons-material";
import { Avatar, Button, List, Stack, SvgIcon } from "@mui/material";
import { Card, CardHeader, Typography } from "@mui/material";
import { Employee, Salary } from "@prisma/client";
import React from "react";
import toast from "react-hot-toast";

export default function StaffCard({
  staff,
}: {
  staff: Employee & { salary: Salary };
}) {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            src={"selectedStaff?.imageUrl"}
            sx={{
              height: 58,
              width: 58,
            }}
          >
            <SvgIcon>
              <Person />
            </SvgIcon>
          </Avatar>
        }
        action={
          <Stack
            direction={"column"}
            spacing={2}
            alignItems={"flex-end"}
            minWidth={500}
          >
            <Stack direction={"row"} gap={2}>
              <Typography>Net Salary:</Typography>
              <Typography>{staff.salary?.basicSalary ?? 0}</Typography>
            </Stack>
            <Stack sx={{ minWidth: { lg: 300 } }} direction="row" gap={3}>
              <Button
                 
                onClick={() => {
                  //   let path = window.location
                  //     .toString()
                  //     .replace("profile", "salary-advice");
                  //   router.push(path);
                }}
                variant="contained"
                size="small"
                startIcon={
                  <SvgIcon fontSize="small">
                    <List />
                  </SvgIcon>
                }
              >
                Salary Advice
              </Button>

              <Button
                 
                onClick={() => {
                  //   let path = window.location
                  //     .toString()
                  //     .replace("profile", "salary-breakdown");
                  //   router.push(path);
                }}
                variant="contained"
                size="small"
                startIcon={
                  <SvgIcon fontSize="small">
                    <EyeIcon />
                  </SvgIcon>
                }
              >
                Breakdown
              </Button>
              <Button
                 
                onClick={async () => {
                  //   let path = window.location
                  //     .toString()
                  //     .replace("profile", "salary-advice");
                  //   router.push(path);
                  const loading = toast.loading("Recalculating Salary...");
                  await recalculateEmployeeSalaryAction(staff.id);
                  toast.dismiss(loading);
                  toast.success("Salary Recalculated Successfully");
                }}
                variant="contained"
                size="small"
                startIcon={
                  <SvgIcon fontSize="small">
                    <List />
                  </SvgIcon>
                }
              >
                Recalculate
              </Button>
            </Stack>
          </Stack>
        }
        title={`${staff.firstName} ${staff?.lastName}`}
        subheader={<Typography variant="caption">{staff?.email}</Typography>}
      />
    </Card>
  );
}
