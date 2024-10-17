export const paths = {
  index: "/",
  auth: {
    jwt: {
      login: "/auth/jwt/login",
      register: "/auth/jwt/register",
    },
  },
  dashboard: {
    index: "/dash",
    accounting: {
      index: "/dash/accounting",
      general_ledger: {
        index: "/dash/accounting/general-ledger",
        chart_of_accounts: "/dash/accounting/general-ledger/chart-of-accounts",
        journal_entries: {
          index: "/dash/accounting/general-ledger/journal-entries",
          create: "/dash/accounting/general-ledger/journal-entries/create",
          reimbursement: "/dash/accounting/general-ledger/journal-entries/reimbursement",
        },
        trial_balance: "/dash/accounting/general-ledger/trial-balance",
        period_close: "/dash/accounting/general-ledger/period-close",
      },
      accounts_receivable: {
        index: "/dash/accounting/accounts-receivable",
        customer_profiles: "/dash/accounting/accounts-receivable/customer-profiles",
        invoices: "/dash/accounting/accounts-receivable/invoices",
        payment_terms: "/dash/accounting/accounts-receivable/payment-terms",
        aging_reports: "/dash/accounting/accounts-receivable/aging-reports",
      },
      accounts_payable: {
        index: "/dash/accounting/accounts-payable",
        vendor_management: "/dash/accounting/accounts-payable/vendor-management",
        bills: "/dash/accounting/accounts-payable/bills",
        payment_schedules: "/dash/accounting/accounts-payable/payment-schedules",
        reminders: "/dash/accounting/accounts-payable/reminders",
      },
      financial_statements: {
        index: "/dash/accounting/financial-statements",
        balance_sheet: "/dash/accounting/financial-statements/balance-sheet",
        income_statement: "/dash/accounting/financial-statements/income-statement",
        cash_flow: "/dash/accounting/financial-statements/cash-flow",
      },
      budgeting_forecasting: {
        index: "/dash/accounting/budgeting-forecasting",
        budget_creation: "/dash/accounting/budgeting-forecasting/budget-creation",
        forecasting_tools: "/dash/accounting/budgeting-forecasting/forecasting-tools",
        variance_analysis: "/dash/accounting/budgeting-forecasting/variance-analysis",
      },
      payroll: {
        index: "/dash/accounting/payroll",
        employee_salaries: "/dash/accounting/payroll/employee-salaries",
        payslip_generation: "/dash/accounting/payroll/payslip-generation",
        tax_deductions: "/dash/accounting/payroll/tax-deductions",
      },
      inventory_management: {
        index: "/dash/accounting/inventory-management",
        stock_levels: "/dash/accounting/inventory-management/stock-levels",
        product_management: "/dash/accounting/inventory-management/product-management",
        inventory_alerts: "/dash/accounting/inventory-management/inventory-alerts",
      },
    },
    hr: {
      index: "/dash/hr",
      employee_profiles: "/dash/hr/employee-profiles",
      benefits_management: "/dash/hr/benefits-management",
      communication_collaboration: "/dash/hr/communication-collaboration",
    },
    construction: {
      index: "/dash/construction",
      building_site_management: {
        index: "/dash/construction/building-site-management",
        projects: "/dash/construction/building-site-management/projects",
        expenses_budgets: "/dash/construction/building-site-management/expenses-budgets",
        subcontractors: "/dash/construction/building-site-management/subcontractors",
      },
      project_tracking: {
        index: "/dash/construction/project-tracking",
        income_tracking: "/dash/construction/project-tracking/income-tracking",
        inventory_usage: "/dash/construction/project-tracking/inventory-usage",
        cost_tracking: "/dash/construction/project-tracking/cost-tracking",
      },
    },
    reporting_analytics: {
      index: "/dash/reporting-analytics",
      reports: {
        index: "/dash/reporting-analytics/reports",
        financial_reports: "/dash/reporting-analytics/reports/financial",
        cash_flow_reports: "/dash/reporting-analytics/reports/cash-flow",
        expense_reports: "/dash/reporting-analytics/reports/expense",
      },
      analytics: {
        index: "/dash/reporting-analytics/analytics",
        project_profitability: "/dash/reporting-analytics/analytics/project-profitability",
        employee_costs: "/dash/reporting-analytics/analytics/employee-costs",
        performance_reports: "/dash/reporting-analytics/analytics/performance-reports",
      },
    },
    settings: {
      index: "/dash/settings",
      user_management: {
        index: "/dash/settings/user-management",
        add_user: "/dash/settings/user-management/add-user",
        roles_permissions: "/dash/settings/user-management/roles-permissions",
      },
      data_security: {
        index: "/dash/settings/data-security",
        security_settings: "/dash/settings/data-security/security-settings",
        data_backup: "/dash/settings/data-security/data-backup",
        two_factor_authentication: "/dash/settings/data-security/2fa-settings",
      },
    },
    workspace: {
      index: "/dash/workspace",
      add_workspace: "/dash/workspace/add-workspace",
      manage_workspace: "/dash/workspace/manage-workspace",
    },
  },
};


// export const paths = {
//   index: "/",
//   auth: {
//     jwt: {
//       login: "/auth/jwt/login",
//       register: "/auth/jwt/register",
//     },
//   },
//   dashboard: {
//     index: "/dash",
//     accounting: {
//       index: "/dash/accounting",
//       general_ledger: {
//         index: "/dash/accounting/general-ledger",
//         chart_of_accounts: "/dash/accounting/general-ledger/chart-of-accounts",
//         journal_entries: {
//           index: "/dash/accounting/general-ledger/journal-entries",
//           create: "/dash/accounting/general-ledger/journal-entries/create",
//           reimbursement:
//             "/dash/accounting/general-ledger/journal-entries/reimbursement",
//         },
//         trial_balance: "/dash/accounting/general-ledger/trial-balance",
//         period_close: "/dash/accounting/general-ledger/period-close",
//       },
//       accounts_receivable: {
//         index: "/dash/accounting/accounts-receivable",
//         customer_profiles:
//           "/dash/accounting/accounts-receivable/customer-profiles",
//         invoices: "/dash/accounting/accounts-receivable/invoices",
//         payment_terms: "/dash/accounting/accounts-receivable/payment-terms",
//         aging_reports: "/dash/accounting/accounts-receivable/aging-reports",
//       },
//       accounts_payable: {
//         index: "/dash/accounting/accounts-payable",
//         vendor_management:
//           "/dash/accounting/accounts-payable/vendor-management",
//         bills: "/dash/accounting/accounts-payable/bills",
//         payment_schedules:
//           "/dash/accounting/accounts-payable/payment-schedules",
//         reminders: "/dash/accounting/accounts-payable/reminders",
//       },
//       financial_statements: {
//         index: "/dash/accounting/financial-statements",
//         balance_sheet: "/dash/accounting/financial-statements/balance-sheet",
//         income_statement:
//           "/dash/accounting/financial-statements/income-statement",
//         cash_flow: "/dash/accounting/financial-statements/cash-flow",
//       },
//       budgeting_forecasting: {
//         index: "/dash/accounting/budgeting-forecasting",
//         budget_creation:
//           "/dash/accounting/budgeting-forecasting/budget-creation",
//         forecasting_tools:
//           "/dash/accounting/budgeting-forecasting/forecasting-tools",
//         variance_analysis:
//           "/dash/accounting/budgeting-forecasting/variance-analysis",
//       },
//       payroll: {
//         index: "/dash/accounting/payroll",
//         employee_salaries: "/dash/accounting/payroll/employee-salaries",
//         payslip_generation: "/dash/accounting/payroll/payslip-generation",
//         tax_deductions: "/dash/accounting/payroll/tax-deductions",
//       },
//       inventory_management: {
//         index: "/dash/accounting/inventory-management",
//         stock_levels: "/dash/accounting/inventory-management/stock-levels",
//         product_management:
//           "/dash/accounting/inventory-management/product-management",
//         inventory_alerts:
//           "/dash/accounting/inventory-management/inventory-alerts",
//       },
//     },
//     hr: {
//       index: "/dash/hr", // Main HR dashboard
//       employees: {
//         index: "/dash/hr/employees", // Employee list/grid page
//         profile: {
//           index: "/dash/hr/employees/profile/:employeeId", // Individual employee profile
//           personal_details:
//             "/dash/hr/employees/profile/:employeeId/personal-details", // Employee's personal information
//           employment_history:
//             "/dash/hr/employees/profile/:employeeId/employment-history", // Employee's job roles and history
//           salary_details:
//             "/dash/hr/employees/profile/:employeeId/salary-details", // Salary and pay information
//           benefits: "/dash/hr/employees/profile/:employeeId/benefits", // Benefits the employee is enrolled in
//         },
//       },
//       benefits: {
//         index: "/dash/hr/benefits", // Benefits management dashboard
//         employee_benefits: "/dash/hr/benefits/employee/:employeeId", // Individual employee's benefits details
//         manage_benefits: "/dash/hr/benefits/manage", // Manage benefits (add, remove, etc.)
//       },
//       payroll: {
//         index: "/dash/hr/payroll", // Payroll management dashboard
//         employee_payroll: "/dash/hr/payroll/employee/:employeeId", // Individual employee payroll details
//         manage_payroll: "/dash/hr/payroll/manage", // Manage payroll runs
//       },
//       communication: {
//         index: "/dash/hr/communication", // HR communication page (e.g., messages, announcements)
//         send_message: "/dash/hr/communication/send", // Send message to employees
//         view_conversation: "/dash/hr/communication/conversation/:employeeId", // View message thread with a specific employee
//       },
//     },
//     construction: {
//       index: "/dash/construction",
//       building_site_management: {
//         index: "/dash/construction/building-site-management",
//         projects: "/dash/construction/building-site-management/projects",
//         expenses_budgets:
//           "/dash/construction/building-site-management/expenses-budgets",
//         subcontractors:
//           "/dash/construction/building-site-management/subcontractors",
//       },
//       project_tracking: {
//         index: "/dash/construction/project-tracking",
//         income_tracking: "/dash/construction/project-tracking/income-tracking",
//         inventory_usage: "/dash/construction/project-tracking/inventory-usage",
//         cost_tracking: "/dash/construction/project-tracking/cost-tracking",
//       },
//     },
//     reporting_analytics: {
//       index: "/dash/reporting-analytics",
//       reports: {
//         index: "/dash/reporting-analytics/reports",
//         financial_reports: "/dash/reporting-analytics/reports/financial",
//         cash_flow_reports: "/dash/reporting-analytics/reports/cash-flow",
//         expense_reports: "/dash/reporting-analytics/reports/expense",
//       },
//       analytics: {
//         index: "/dash/reporting-analytics/analytics",
//         project_profitability:
//           "/dash/reporting-analytics/analytics/project-profitability",
//         employee_costs: "/dash/reporting-analytics/analytics/employee-costs",
//         performance_reports:
//           "/dash/reporting-analytics/analytics/performance-reports",
//       },
//     },
//     settings: {
//       index: "/dash/settings",
//       user_management: {
//         index: "/dash/settings/user-management",
//         add_user: "/dash/settings/user-management/add-user",
//         roles_permissions: "/dash/settings/user-management/roles-permissions",
//       },
//       data_security: {
//         index: "/dash/settings/data-security",
//         security_settings: "/dash/settings/data-security/security-settings",
//         data_backup: "/dash/settings/data-security/data-backup",
//         two_factor_authentication: "/dash/settings/data-security/2fa-settings",
//       },
//     },
//     workspace: {
//       index: "/dash/workspace",
//       add_workspace: "/dash/workspace/add-workspace",
//       manage_workspace: "/dash/workspace/manage-workspace",
//     },
//   },
// };
