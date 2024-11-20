import { InventoryCategory } from "@prisma/client";

export const TOP_NAV_HEIGHT = 64;
export const CURRENT_ORG_KEY = "Current_organizaition";
export const ADD_INGPROJECT_ID = "LATEST_PROJECT";
export const ERROR_MESSAGE = "Something went wrong: Please contact support";

export const REIMBURSEMENT_ACCOUNT_ID = "YOUR_REIMBURSEMENT_ACCOUNT_ID"; // Replace with the actual ID

export const REIMBURSEMENT_ACCOUNT_NAME = "Reimbursement Account"; // Replace with the actual name
export const REIMBURSEMENT_ACCOUNT_NUMBER = "REIMB_ACCOUNT"; // Replace with the actual number
export const REIMBURSEMENT_ACCOUNT_TYPE = "EXPENSE"; // Replace with the actual type

// SYSTEM ACCOUNTS CODE

// Asset Accounts
const ASSETS_ACCOUNT = "1000";
const CURRENT_ASSETS_ACCOUNT = "1100";
const CASH_AND_CASH_EQUIVALENTS_ACCOUNT = "1101";
const ACCOUNTS_RECEIVABLE_ACCOUNT = "1102";
const INVENTORY_ACCOUNT = "1103";
const RAW_MATERIALS_ACCOUNT = "1103-1";
const WORK_IN_PROGRESS_ACCOUNT = "1103-2";
const FINISHED_GOODS_ACCOUNT = "1103-3";
const FIXED_ASSETS_ACCOUNT = "1200";
const LAND_ACCOUNT = "1201";
const BUILDINGS_ACCOUNT = "1202";
const EQUIPMENT_AND_MACHINERY_ACCOUNT = "1203";
const ACCUMULATED_DEPRECIATION_ACCOUNT = "1204";

// Liability Accounts
const LIABILITIES_ACCOUNT = "2000";
const ACCOUNTS_PAYABLE_ACCOUNT = "2100";
const SHORT_TERM_LOANS_ACCOUNT = "2200";
const LONG_TERM_DEBT_ACCOUNT = "2300";

// Equity Accounts
const EQUITY_ACCOUNT = "3000";
const OWNERS_EQUITY_ACCOUNT = "3100";
const RETAINED_EARNINGS_ACCOUNT = "3200";

// Revenue Accounts
const REVENUE_ACCOUNT = "4000";
const SALES_REVENUE_ACCOUNT = "4100";
const SERVICE_REVENUE_ACCOUNT = "4200";

// Expense Accounts
const EXPENSES_ACCOUNT = "5000";
const COST_OF_GOODS_SOLD_ACCOUNT = "5100";
const SALARIES_AND_WAGES_ACCOUNT = "5200";
const UTILITIES_EXPENSE_ACCOUNT = "5300";
const DEPRECIATION_EXPENSE_ACCOUNT = "5400";

const INVENTORY_CATEGORY_ACCOUNTS: Record<InventoryCategory, string> = {
  [InventoryCategory.RAW_MATERIALS]: RAW_MATERIALS_ACCOUNT, // Raw materials inventory
  [InventoryCategory.WORK_IN_PROGRESS]: WORK_IN_PROGRESS_ACCOUNT, // Work in progress inventory
  [InventoryCategory.FINISHED_GOODS]: FINISHED_GOODS_ACCOUNT, // Finished goods inventory
  [InventoryCategory.MRO_SUPPLIES]: EQUIPMENT_AND_MACHINERY_ACCOUNT, // Fixed assets or consumable MRO supplies
  [InventoryCategory.CONSUMABLES]: UTILITIES_EXPENSE_ACCOUNT, // Consumables expense
  [InventoryCategory.PACKAGING]: COST_OF_GOODS_SOLD_ACCOUNT, // Packaging expense or inventory
  [InventoryCategory.HIGH_VALUE_ITEMS]: FIXED_ASSETS_ACCOUNT, // Fixed assets for high-value items
  [InventoryCategory.NON_INVENTORY_ITEMS]: UTILITIES_EXPENSE_ACCOUNT, // Non-inventory item expense
  [InventoryCategory.EQUIPMENT]: LAND_ACCOUNT, // Fixed assets for equipment
  [InventoryCategory.ASSETS]: FIXED_ASSETS_ACCOUNT, // General fixed assets
  [InventoryCategory.RENTAL_ITEMS]: BUILDINGS_ACCOUNT, // Fixed assets or rental items inventory
  [InventoryCategory.PACKAGING_MATERIALS]: COST_OF_GOODS_SOLD_ACCOUNT, // Packaging materials inventory
  [InventoryCategory.TESTING_EQUIPMENT]: EQUIPMENT_AND_MACHINERY_ACCOUNT, // Fixed assets for testing equipment
  [InventoryCategory.PERISHABLE_GOODS]: INVENTORY_ACCOUNT, // Perishable goods inventory
  [InventoryCategory.RETURNED_GOODS]: INVENTORY_ACCOUNT, // Returned goods inventory
  [InventoryCategory.REFURBISHED_GOODS]: INVENTORY_ACCOUNT, // Refurbished goods inventory
  [InventoryCategory.SPARE_PARTS]: INVENTORY_ACCOUNT, // Spare parts inventory
  [InventoryCategory.OFFICE_SUPPLIES]: EQUIPMENT_AND_MACHINERY_ACCOUNT, // Office supplies expense
  [InventoryCategory.SOFTWARE_LICENSES]: EQUIPMENT_AND_MACHINERY_ACCOUNT, // Intangible assets for software licenses
  [InventoryCategory.PROMOTIONAL_ITEMS]: EQUIPMENT_AND_MACHINERY_ACCOUNT, // Promotional items expense
};

export {
  ASSETS_ACCOUNT,
  CURRENT_ASSETS_ACCOUNT,
  CASH_AND_CASH_EQUIVALENTS_ACCOUNT,
  ACCOUNTS_RECEIVABLE_ACCOUNT,
  INVENTORY_ACCOUNT,
  RAW_MATERIALS_ACCOUNT,
  WORK_IN_PROGRESS_ACCOUNT,
  FINISHED_GOODS_ACCOUNT,
  FIXED_ASSETS_ACCOUNT,
  LAND_ACCOUNT,
  BUILDINGS_ACCOUNT,
  EQUIPMENT_AND_MACHINERY_ACCOUNT,
  ACCUMULATED_DEPRECIATION_ACCOUNT,
  LIABILITIES_ACCOUNT,
  ACCOUNTS_PAYABLE_ACCOUNT,
  SHORT_TERM_LOANS_ACCOUNT,
  LONG_TERM_DEBT_ACCOUNT,
  EQUITY_ACCOUNT,
  OWNERS_EQUITY_ACCOUNT,
  RETAINED_EARNINGS_ACCOUNT,
  REVENUE_ACCOUNT,
  SALES_REVENUE_ACCOUNT,
  SERVICE_REVENUE_ACCOUNT,
  EXPENSES_ACCOUNT,
  COST_OF_GOODS_SOLD_ACCOUNT,
  SALARIES_AND_WAGES_ACCOUNT,
  UTILITIES_EXPENSE_ACCOUNT,
  DEPRECIATION_EXPENSE_ACCOUNT,
  INVENTORY_CATEGORY_ACCOUNTS,
};
