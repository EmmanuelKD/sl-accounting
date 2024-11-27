import { paths } from "@/paths";
import {
  Assessment,
  Person2,
  Report,
  Settings,
  Work,
} from "@mui/icons-material";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Dashboard",
    path: paths.dashboard.index,
    icon: <Assessment />,

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
        title: "General Ledger",
        path: paths.dashboard.accounting.general_ledger.index,
      },
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
        title: "Payroll",
        path: paths.dashboard.accounting.payroll.index,
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
    icon:   <Person2 />,
    items: [
      {
        title: "Employees",
        path: paths.dashboard.hr.employees,
      },
      // {
      //   title: "Benefits Management",
      //   path: paths.dashboard.hr.benefits_management,
      // },
      {
        title: "Communication & Collaboration",
        path: paths.dashboard.hr.communication_collaboration,
      },
    ],
  },
  // Construction
  // {
  //   title: "Construction Management",
  //   path: paths.dashboard.construction.index,
  //   icon: (
  //     <SvgIcon>
  //       <Work />
  //     </SvgIcon>
  //   ),
  //   items: [
  //     {
  //       title: "Building Site Management",
  //       path: paths.dashboard.construction.building_site_management.index,
  //     },
  //     {
  //       title: "Project Tracking",
  //       path: paths.dashboard.construction.project_tracking.index,
  //     },
  //   ],
  // },
  {
    title: "Reporting & Analytics",
    path: paths.dashboard.reporting_analytics.index,
    icon: <Report />,
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
    title: "Settings & User Mgnt.",
    path: paths.dashboard.settings.index,
    icon: <Settings />,
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
