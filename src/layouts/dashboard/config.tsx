import { paths } from "@/paths";
import { Assessment, Work } from "@mui/icons-material";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Dashboard",
    path: paths.dashboard.index,
    icon: (
      <SvgIcon>
        <Assessment />
      </SvgIcon>
    ),

    items: [
      {
        title: "Overview",
        path: paths.dashboard.index,
      },
    ],
  },
  // accounting
  {
    title: "Core Accounting",
    path: paths.dashboard.accounting.index,
    icon: (
      <SvgIcon>
        <Work />
      </SvgIcon>
    ),
    items: [
      {
        title: "Accounts Receivable",
        path: paths.dashboard.accounting.accounts_receivable.index,
      },
      {
        title: "Accounts Payable",
        path: paths.dashboard.accounting.accounts_payable.index,
      },
      {
        title: "Financial Statements",
        path: paths.dashboard.accounting.financial_statements.index,
      },
      {
        title: "Budgeting and Forecasting",
        path: paths.dashboard.accounting.budgeting_forecasting.index,
      },
      {
        title: "Inventory Management",
        path: paths.dashboard.accounting.inventory_management.index,
      },
    ],
  },
  // hr
  {
    title: "Human Resources",
    path: paths.dashboard.hr.index,
    icon: (
      <SvgIcon>
        <Work />
      </SvgIcon>
    ),
    items: [
      {
        title: "Employee Profiles",
        path: paths.dashboard.hr.employee_profiles,
      },
      {
        title: "Benefits Management",
        path: paths.dashboard.hr.benefits_management,
      },
      {
        title: "Communication & Collaboration",
        path: paths.dashboard.hr.communication_collaboration,
      },
    ],
  },
  // Construction
  {
    title: "Construction Management",
    path: paths.dashboard.construction.index,
    icon: (
      <SvgIcon>
        <Work />
      </SvgIcon>
    ),
    items: [
      {
        title: "Building Site Management",
        path: paths.dashboard.construction.building_site_management.index,
      },
      {
        title: "Project Tracking",
        path: paths.dashboard.construction.project_tracking.index,
      },
    ],
  },
  {
    title: "Reporting & Analytics",
    path: paths.dashboard.reporting_analytics.index,
    icon: (
      <SvgIcon>
        <Work />
      </SvgIcon>
    ),
    items: [
      {
        title: "Reports",
        path: paths.dashboard.reporting_analytics.reports.index,
      },
      {
        title: "Analytics",
        path: paths.dashboard.reporting_analytics.analytics.index,
      },
    ],
  },
  {
    title: "Settings & User Management",
    path: paths.dashboard.settings.index,
    icon: (
      <SvgIcon>
        <Work />
      </SvgIcon>
    ),
    items: [
      {
        title: "User Management",
        path: paths.dashboard.settings.user_management.index,
      },
      {
        title: "Data Security",
        path: paths.dashboard.settings.data_security.index,
      },
    ],
  },
];
