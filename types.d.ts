import { Account } from "@prisma/client";

type AccountMinimal = Omit<
  Account,
  | "createdAt"
  | "updatedAt"
  // | "balance"
  // | "status"
  // | "transactions"
  // | "journalEntries"
>;

interface OrgType {
  name: string;
  phoneNumber: string;
  email: string;
  desctiption: string;
  imageUrl: string;
  id: string;
}

interface RolesType {
  id: string;
  description: string;
  Staff?: StaffType[];
  salaray: number;
  name: string;
  orgId: string;
}

interface BonuseType {
  id: string;
  description: string;
  amount: number;
  percentageOffSalary?: number;
  name: string;
  orgId: string;
  StaffBonuse: StaffBonuseType[];
  isTaxable: boolean;
}

interface StaffBonuseType {
  id: string;
  Staff: StaffType;
  staffId: string;
  Bonuse: BonuseType;
  bonusId: string;
}

interface StaffType {
  id: string;
  fname: string;
  lname: string;
  imageUrl: string;
  address: string;
  phoneNumber: string;
  email: string;
  emergencyContact: string;
  SSN: string;
  isVeteran: boolean;
  isDisability: boolean;
  organizationsId: string[];
  positionsTitle: string;
  roleAndSalaryId: string;
  employmentType: "Fulltime" | "Contract" | "Internship";
  startDate: Date;
  gender: "Male" | "Female";
  StaffBonuse: StaffBonuseType[];
  RoleAndSalary?: RolesType;
}

interface SourceOfIncome {
  id?: string;
  sourceName?: string;
  sourceId: string;
  sourceType: TransactionSource;
}

interface BeneficiaryOfExpences {
  id?: string;
  beneficiaryName?: string;
  beneficiaryId: string;
  beneficiaryType: TransactionSource;
  purpose: "Other" | "Lending" | "Reimbursing";
}

interface IncomeType {
  orgId: string;
  sourceOfIncome: SourceOfIncome;
  organization?: OrgType;
  project?: ProjectType;
  id: string;
  reimbursable: boolean;
  forProject: string;
  amount: number;
  frequencyId?: string;
  dateReceived: Date;
  notes: string; // Include any additional notes related to the income source, like bonuses or special circumstances.
  currency: string;
  title: string;
  ReimbursementList?: ReimbursementType[];
}

interface ReimbursementType {
  amountPaid: number;
  amountRemain: number;
  createdAt?: Date; // Assuming createdAt is a string representation of a date
  id?: string;
  incomeId: string;
  orgId: string;
  reimbursementDate: Date; // Assuming reimbursementDate is a string representation of a date
  updatedAt?: Date;
}

type ReimbusmentDisplayable = {
  lendersName: string;
  amountPaid: number;
  currency: string;
  sourceType: string;
  oreginalAmount: number;
  amountRemaining: number;
  sourceId: string;
  incomeId: string;
  orgId: string;
  id: string;
};

// title
// amount
// dateEncoured
// currency
// description
// expencesToId
// expencesTo

interface CustomerType {
  id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  txn: string; // tax number
  billingAddress: string;
  billingName: string;
  billingNumber: string;
  billingProvince: string;
  billingTown: string;
  billingCountry: string;

  shippingAddress: string;
  shippingName: string;
  shippingNumber: string;
  shippingProvince: string;
  shippingTown: string;
  shippingCountry: string;
}
interface ExpensesType {
  id: string;
  _orgId: string;
  forProject: string;
  title: string;
  dateEncoured: Date;
  notes: string; // Include any additional notes related to the income source, like bonuses or special circumstances.
  currency: string;
  amount: number;
  beneficiary?: BeneficiaryOfExpences;
  // reimbursingTo: BeneficiaryOfExpences;
}

interface ConversionRatesType {
  id: string;
  _orgId: string;
  Conversions: ConversionsType;
  conversionsId: string;
  rateDate: Date;
  amountNow: number;
  amountFrom: number;
}

interface ConversionsType {
  id: string;
  _defaultValue: number;
  _dateValueDate: Date;
  name: string;
  ConversionRates?: ConversionRatesType[];
}

// type TransactionFrequencyType = "monthly" | "bi-weekly" | "annually";
type TransactionSource = "staff" | "organization" | "projects" | "other";

let ExpensesCategory = [
  {
    category: "Operational Expenses",
    subCategory: [
      "Salaries and Wages",
      "Rent and Utilities",
      "Office Supplies",
      "Communication",
      "Travel and Transportation",
      "Insurance",
      "Maintenance and Repairs",
      "Marketing and Advertising",
      "Professional Fees",
      "Software and Subscriptions",
    ],
  },
  {
    category: "Cost of Goods Sold",
    subCategory: ["Raw Materials", "Direct Labor", "Manufacturing Overheads"],
  },
  {
    category: "Financial Expenses",
    subCategory: ["Interest", "Bank Fees", "Credit Card Interest and Fees"],
  },
  {
    category: "Depreciation and Amortization",
    subCategory: ["Depreciation", "Amortization"],
  },
  {
    category: "Rent and Lease Expenses",
    subCategory: ["Equipment Leases", "Property Leases"],
  },
  {
    category: "Employee Benefits",
    subCategory: [
      "Healthcare and Insurance",
      "Retirement Contributions",
      "Bonuses and Incentives",
    ],
  },
  {
    category: "Taxes",
    subCategory: ["Income Taxes", "Sales Taxes", "Property Taxes"],
  },
  {
    category: "Research and Development (R&D)",
    subCategory: ["R&D Expenses"],
  },
  {
    category: "Miscellaneous",
    subCategory: ["Miscellaneous Expenses"],
  },
  {
    category: "Interest and Dividends",
    subCategory: ["Interest Income", "Dividend Income"],
  },
];

enum TransactionType {
  income = "Income",
  Expenses = "Expenses",
  PettyCash_Income = "PettyCash_Income",
  PettyCash_Expenses = "PettyCash_Expenses",
}

interface ProjectType {
  id: string;
  name: string;
  projectLocation?: ProjectLocationType[] | string[];
  startDate: Date;
  endDate: Date;
  organizationId: string;
  manager?: StaffType;
  managerId: string;
  phases?: ProjectPhase[];
  materials?: Material[];
  equipment?: Equipment[];
  expenses?: Expenses[];
  income?: Income[];
  description: string;
  // phases?: ProjectPhase[] | string[];
  // materials?: Material[] | string[];
  // equipment?: Equipment[] | string[];
  // expenses?: Expenses[] | string[];
  // income?: Income[] | string[];
}

// This can be something used to do the work
interface Equipment {
  id?: string;
  name: string;
  cost: number;
  depreciationPerYear: number;
  // projectLocation: ProjectLocationType | string[];
  isAvailable: boolean;
  datePurchased: Date;
}

declare module "react-excel-renderer";

interface ProjectLocationType {
  id?: string;
  projectId?: string;
  material?: Material[];
  equipmentAssignmed?: EquipmentAssignmed[];
  name: string;
  lat: number | null;
  lng: number | null;
}

interface Material {
  id?: string;
  name: string;
  projectId?: string;
  projectLocation?: ProjectLocationType;
  locationId: string;
  unit: number;
  unitPrice: number;
  datePurchased: Date;
}

interface ProjectPhase {
  // to do
  id?: string;
  projectId: string;
  project?: ProjectType;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  isMilestone: boolean;
  cashInOnComplete: boolean;
  amountOnCashout: number;
  cashOutOnComplete: boolean;
  amountOnCashin: number;
}

type EquipmentAssignmed = {
  id?: string;
  projectId: string;
  equipmentId: string;
  projectLocation?: ProjectLocation;
  locationId: string;
  createdAt?: date;
  updatedAt?: Date;
};

type PettyCash = {
  currency: string;
  description: string;
  amount: number;
  title: string;
  type: string;
  dateEncoured: Date;
  _orgId: string;
};

type AuthType = {
  email: string;
  password: string;
};

type SystemSettingType = {
  id: string;
  NASSITSalaryRate: string;
};

type NASSITthreshold = {
  initialPercent: number;
  thresholdFree: number;
};

interface NassitRates extends NASSITthreshold {
  id?: string;
  rateDate: Date;
}

type NassitAllowanceCalculations = {
  allowance: number;
  taxable: number;
  taxableIncome: number;
  thresholdFree: number;
  salariesThresholds: SalaryThreshold[];
  totalTax: number;
};

type SalaryThreshold = {
  remainingIncome: number;
  currentPercent: number;
  numberOfThreshold: number;
  thrasholdAmount: number;
};

type TaxCalculationsType = {
  basicSalary: number;
  allowance: number;
  gross: number;
  nassit: number;
  taxable: number;
  taxableIncome: number;
  thresholdFree: number;
  salariesThresholds: SalaryThreshold[];
  totalTax: number;
};

type NRA_DATA = {
  serial: number;
  employeeFullName: string;
  basicMonthly: number;
  nassitDeduction: number;
  monthlyAllowance: number;
  grossMonthly: number;
  taxDeduction: number;
  remarks: string;
};

type NASSIT_DATA = {
  serialNO: string;
  employeeName: string;
  socialSecurity: string;
  basicSalary: number;
  [key: string]: unknown;
};

type PayList_DATA = {
  staffId: string;
  staffName: string;
  staffPosition: string;
  staffStipend: number;
  bonus: number;
  basicSalary: number;
  grossSalary: number;
  nassit: number;
  taxDeduction: number;
  loanDeducitons: number;
  fine: number;
  allowance: number;
  netSalary: number;
  finalNetSalary: number;
};
