import {
  ACCOUNTS_PAYABLE_ACCOUNT,
  ACCOUNTS_RECEIVABLE_ACCOUNT,
  ACCUMULATED_DEPRECIATION_ACCOUNT,
  ASSETS_ACCOUNT,
  BUILDINGS_ACCOUNT,
  CASH_AND_CASH_EQUIVALENTS_ACCOUNT,
  CONTRA_ASSETS_ACCOUNT,
  COST_OF_GOODS_SOLD_ACCOUNT,
  CURRENT_ASSETS_ACCOUNT,
  DEPRECIATION_EXPENSE_ACCOUNT,
  DISCOUNT_ACCOUNT,
  EQUIPMENT_AND_MACHINERY_ACCOUNT,
  EQUITY_ACCOUNT,
  EXPENSES_ACCOUNT,
  FINISHED_GOODS_ACCOUNT,
  FIXED_ASSETS_ACCOUNT,
  INVENTORY_ACCOUNT,
  INVENTORY_CATEGORY_ACCOUNTS,
  LAND_ACCOUNT,
  LIABILITIES_ACCOUNT,
  LONG_TERM_DEBT_ACCOUNT,
  OWNERS_EQUITY_ACCOUNT,
  RAW_MATERIALS_ACCOUNT,
  REIMBURSEMENT_ACCOUNT_ID,
  REIMBURSEMENT_ACCOUNT_NAME,
  REIMBURSEMENT_ACCOUNT_NUMBER,
  REIMBURSEMENT_ACCOUNT_TYPE,
  RETAINED_EARNINGS_ACCOUNT,
  REVENUE_ACCOUNT,
  SALARIES_AND_WAGES_ACCOUNT,
  SALES_REVENUE_ACCOUNT,
  SERVICE_REVENUE_ACCOUNT,
  SHORT_TERM_LOANS_ACCOUNT,
  UTILITIES_EXPENSE_ACCOUNT,
  WORK_IN_PROGRESS_ACCOUNT,
} from "@/const";
import { HttpError } from "@/utils/errorHandler";
import { calculateTax } from "@/utils/tax-calculatory";
// import { generateOrderAccount } from "@/utils/generator";
import {
  AccountStatus,
  AccountType,
  Address,
  Benefit,
  Deduction,
  Employee,
  EmploymentStatus,
  InventoryItem,
  // Salary,
  LeaveStatus,
  LeaveType,
  MaritalStatus,
  PaymentMode,
  PrismaClient,
  Reimbursement,
  TransactionType,
  UploadFile,
  Vendor,
} from "@prisma/client";
import { VendorMetadata } from "types";
const prisma = new PrismaClient();
// creating account

export async function createDefaultAccounts(workspaceId: string) {
  const defaultAccounts = [
    // Assets ans cub accounts
    {
      name: "Assets",
      number: ASSETS_ACCOUNT,
      type: AccountType.ASSET,
      status: AccountStatus.ACTIVE,
      balance: 0,
      workspaceId: workspaceId,
      subAccounts: {
        create: [
          {
            name: "Current Assets",
            number: CURRENT_ASSETS_ACCOUNT,
            type: AccountType.ASSET,
            status: AccountStatus.ACTIVE,
            balance: 0,
            workspaceId: workspaceId,
            subAccounts: {
              create: [
                {
                  name: "Cash and Cash Equivalents",
                  number: CASH_AND_CASH_EQUIVALENTS_ACCOUNT,
                  type: AccountType.ASSET,
                  balance: 0,
                  status: AccountStatus.ACTIVE,
                  workspaceId: workspaceId,
                },
                {
                  name: "Accounts Receivable",
                  number: ACCOUNTS_RECEIVABLE_ACCOUNT,
                  type: AccountType.ASSET,
                  balance: 0,
                  status: AccountStatus.ACTIVE,
                  workspaceId: workspaceId,
                },
                {
                  name: "Inventory",
                  number: INVENTORY_ACCOUNT,
                  type: AccountType.ASSET,
                  balance: 0,
                  status: AccountStatus.ACTIVE,
                  workspaceId: workspaceId,
                  subAccounts: {
                    create: [
                      {
                        name: "Raw Materials",
                        number: RAW_MATERIALS_ACCOUNT,
                        type: AccountType.ASSET,
                        balance: 0,
                        status: AccountStatus.ACTIVE,
                        workspaceId: workspaceId,
                      },
                      {
                        name: "Work-in-Progress",
                        number: WORK_IN_PROGRESS_ACCOUNT,
                        type: AccountType.ASSET,
                        balance: 0,
                        status: AccountStatus.ACTIVE,
                        workspaceId: workspaceId,
                      },
                      {
                        name: "Finished Goods",
                        number: FINISHED_GOODS_ACCOUNT,
                        type: AccountType.ASSET,
                        balance: 0,
                        status: AccountStatus.ACTIVE,
                        workspaceId: workspaceId,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Fixed Assets",
            number: FIXED_ASSETS_ACCOUNT,
            type: AccountType.ASSET,
            status: AccountStatus.ACTIVE,
            balance: 0,
            workspaceId: workspaceId,
            subAccounts: {
              create: [
                {
                  name: "Land",
                  number: LAND_ACCOUNT,
                  type: AccountType.ASSET,
                  balance: 0,
                  status: AccountStatus.ACTIVE,
                  workspaceId: workspaceId,
                },
                {
                  name: "Buildings",
                  number: BUILDINGS_ACCOUNT,
                  type: AccountType.ASSET,
                  balance: 0,
                  status: AccountStatus.ACTIVE,
                  workspaceId: workspaceId,
                },
                {
                  name: "Equipment and Machinery",
                  number: EQUIPMENT_AND_MACHINERY_ACCOUNT,
                  type: AccountType.ASSET,
                  balance: 0,
                  status: AccountStatus.ACTIVE,
                  workspaceId: workspaceId,
                },
              ],
            },
          },
        ],
      },
    },
    // Liabilities and Subaccounts
    {
      name: "Liabilities",
      number: LIABILITIES_ACCOUNT,
      type: AccountType.LIABILITY,
      balance: 0,
      status: AccountStatus.ACTIVE,
      workspaceId: workspaceId,
      subAccounts: {
        create: [
          {
            name: "Accounts Payable",
            number: ACCOUNTS_PAYABLE_ACCOUNT,
            type: AccountType.LIABILITY,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
          {
            name: "Short-term Loans",
            number: SHORT_TERM_LOANS_ACCOUNT,
            type: AccountType.LIABILITY,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
          {
            name: "Long-term Debt",
            number: LONG_TERM_DEBT_ACCOUNT,
            type: AccountType.LIABILITY,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
        ],
      },
    },
    // Equity and Subaccounts
    {
      name: "Equity",
      number: EQUITY_ACCOUNT,
      type: AccountType.EQUITY,
      balance: 0,
      status: AccountStatus.ACTIVE,
      workspaceId: workspaceId,
      subAccounts: {
        create: [
          {
            name: "Owner's Equity",
            number: OWNERS_EQUITY_ACCOUNT,
            type: AccountType.EQUITY,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
          {
            name: "Retained Earnings",
            number: RETAINED_EARNINGS_ACCOUNT,
            type: AccountType.EQUITY,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
        ],
      },
    },
    // Revenue and Subaccounts
    {
      name: "Revenue",
      number: REVENUE_ACCOUNT,
      type: AccountType.REVENUE,
      balance: 0,
      status: AccountStatus.ACTIVE,
      workspaceId: workspaceId,
      subAccounts: {
        create: [
          {
            name: "Sales Revenue",
            number: SALES_REVENUE_ACCOUNT,
            type: AccountType.REVENUE,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
          {
            name: "Service Revenue",
            number: SERVICE_REVENUE_ACCOUNT,
            type: AccountType.REVENUE,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
        ],
      },
    },
    // Expenses and Subaccounts
    {
      name: "Expenses",
      number: EXPENSES_ACCOUNT,
      type: AccountType.EXPENSE,
      balance: 0,
      status: AccountStatus.ACTIVE,
      workspaceId: workspaceId,
      subAccounts: {
        create: [
          {
            name: "Cost of Goods Sold",
            number: COST_OF_GOODS_SOLD_ACCOUNT,
            type: AccountType.EXPENSE,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
          {
            name: "Salaries and Wages",
            number: SALARIES_AND_WAGES_ACCOUNT,
            type: AccountType.EXPENSE,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
          {
            name: "Utilities Expense",
            number: UTILITIES_EXPENSE_ACCOUNT,
            type: AccountType.EXPENSE,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
          {
            name: "Depreciation Expense",
            number: DEPRECIATION_EXPENSE_ACCOUNT,
            type: AccountType.EXPENSE,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
        ],
      },
    },
    // Contra Asset And sub accounts
    {
      name: "Contra Assets",
      number: CONTRA_ASSETS_ACCOUNT,
      type: AccountType.CONTRA_ASSET,
      balance: 0,
      status: AccountStatus.ACTIVE,
      workspaceId: workspaceId,
      subAccounts: {
        create: [
          {
            name: "Accumulated Depreciation",
            number: ACCUMULATED_DEPRECIATION_ACCOUNT,
            type: AccountType.CONTRA_ASSET,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
          {
            name: "Discount",
            number: DISCOUNT_ACCOUNT,
            type: AccountType.CONTRA_ASSET,
            balance: 0,
            status: AccountStatus.ACTIVE,
            workspaceId: workspaceId,
          },
        ],
      },
    },
  ];

  try {
    for (const account of defaultAccounts) {
      await prisma.account.create({
        data: account,
      });
    }
    console.log("Default accounts created successfully!");
  } catch (error) {
    console.error("Error creating default accounts:", error);
  }
}

export const creditAccount = async (accountId: string, amount: number) => {
  await prisma.account.update({
    where: { id: accountId },
    data: { balance: { increment: amount } },
  });
};
export const debitAccount = async (accountId: string, amount: number) => {
  await prisma.account.update({
    where: { id: accountId },
    data: { balance: { decrement: amount } },
  });
};
export const createAccount = async (accountData: {
  name: string;
  number: string;
  type: AccountType;
  balance?: number;
  parentAccountId?: string; // optional parent account
  workspaceId: string;
}) => {
  try {
    if (accountData.workspaceId) {
      const workspace = await prisma.workspace.findUnique({
        where: {
          id: accountData.workspaceId,
        },
      });

      if (!workspace) {
        throw new HttpError({
          code: 404,
          success: false,
          message: "Workspace not found",
        });
      }
    } else {
      throw new HttpError({
        code: 404,
        success: false,
        message: "Workspace not found",
      });
    }

    const account = await prisma.account.create({
      data: {
        name: accountData.name,
        number: accountData.number,
        type: accountData.type,
        balance: Number.parseFloat((accountData.balance || "0").toString()),
        workspace: {
          connect: { id: accountData.workspaceId },
        },
        ...(accountData.parentAccountId && {
          parentAccount: {
            connect: { id: accountData.parentAccountId },
          },
        }),
      },
    });

    return account;
  } catch (error) {
    throw new HttpError({
      code: 500,
      success: false,
      message: (error as any).message || "Failed to create account",
      error: error,
    });
  }
};
export const changeAccountParent = async (
  accountId: string,
  parentAccountId: string
) => {
  const updated=await prisma.account.update({
    where: { id: accountId },
    data: {
      parentAccountId,
    },
  });
  return await prisma.account.findMany({
    where:{
      workspaceId:updated.workspaceId
    },
    select: {
      id: true,
      name: true,
      number: true,
      type: true,
      balance: true,
      workspaceId: true,
      parentAccountId: true,
    },
  });
};

export const getAccountById = async (id: string) => {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        subAccounts: true, // include sub-accounts for hierarchy
      },
      where: {
        id: id,
      },
    });
    return accounts;
  } catch (error) {
    throw new HttpError({
      code: 500,
      success: false,
      message: "Failed to fetch accounts",
      error: error,
    });
  }
};

export const getAccounts = async (workspaceId:string) => {
  try {
    const accounts = await prisma.account.findMany({
      where:{
        workspaceId
      },
      select: {
        id: true,
        name: true,
        number: true,
        type: true,
        balance: true,
        workspaceId: true,
        parentAccountId: true,
      },
    });
    return accounts;
  } catch (error) {
    throw new HttpError({
      code: 500,
      success: false,
      message: "Failed to fetch accounts",
      error: error,
    });
  }
};

export const updateAccount = async (
  id: string,
  updateData: {
    name?: string;
    number?: string;
    type?: AccountType;
    balance?: number;
    status?: AccountStatus;
    parentAccountId?: string;
  }
) => {
  try {
    const updatedAccount = await prisma.account.update({
      where: { id },
      data: {
        ...(updateData.number && { number: updateData.number }),
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.type && { type: updateData.type }),
        ...(updateData.balance && {
          balance: Number.parseFloat(updateData.balance.toString()),
        }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.parentAccountId && {
          parentAccountId: updateData.parentAccountId,
        }),
      },
    });
    return updatedAccount;
  } catch (error) {
    throw new HttpError({
      code: 500,
      success: false,
      message: "Failed to update account",
      error: error,
    });
  }
};

// This method checks if the account balance is correct by summing up all the transactions for the account and subtracting the debits from the credits
export async function automaticallyCheckAndUpdateAccountBalance(
  accountId: string
) {
  // Get the account's current balance
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { balance: true },
  });

  if (!account) {
    throw new HttpError({
      code: 404,
      success: false,
      message: "Account not found",
    });
  }

  // Calculate the transaction-based balance
  const transactions = await prisma.transaction.groupBy({
    by: ["type"],
    where: { accountId },
    _sum: { amount: true },
  });

  // Calculate the balance: credits - debits
  const creditSum =
    transactions.find((t) => t.type === "CREDIT")?._sum.amount || 0;
  const debitSum =
    transactions.find((t) => t.type === "DEBIT")?._sum.amount || 0;
  const calculatedBalance = creditSum - debitSum;

  // Check if the balances are different
  if (calculatedBalance !== account.balance) {
    // Update the account balance to match the transaction balance
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: { balance: calculatedBalance },
    });

    console.log(
      `Account balance updated from ${account.balance} to ${calculatedBalance}`
    );
    return updatedAccount.balance;
  } else {
    console.log("Account balance is correct");
    return account.balance;
  }
}

// This method automatically updates the account balance by summing up all the transactions for the account and subtracting the debits from the credits
export async function automaticallyUpdateAccountBalance(accountId: string) {
  // Aggregate the total debit and credit for the account
  const transactions = await prisma.transaction.groupBy({
    by: ["type"],
    where: { accountId },
    _sum: { amount: true },
  });

  // Calculate the balance: credits - debits
  const creditSum =
    transactions.find((t) => t.type === "CREDIT")?._sum.amount || 0;
  const debitSum =
    transactions.find((t) => t.type === "DEBIT")?._sum.amount || 0;
  const calculatedBalance = creditSum - debitSum;

  // Update the account balance in the database
  const updatedAccount = await prisma.account.update({
    where: { id: accountId },
    data: { balance: calculatedBalance },
  });

  return updatedAccount.balance;
}

export const deleteAccount = async (id: string) => {
  try {
    const deletedAccount = await prisma.account.delete({
      where: { id },
    });
    return deletedAccount;
  } catch (error) {
    throw new HttpError({
      code: 500,
      success: false,
      message: "Failed to delete account",
      error: error,
    });
  }
};

export const calculateAccountBalance = async (accountId: string) => {
  try {
    // Sum of all debit transactions
    const totalDebits = await prisma.transaction.aggregate({
      where: {
        accountId,
        type: "DEBIT",
      },
      _sum: {
        amount: true,
      },
    });

    // Sum of all credit transactions
    const totalCredits = await prisma.transaction.aggregate({
      where: {
        accountId,
        type: "CREDIT",
      },
      _sum: {
        amount: true,
      },
    });

    // Compute balance (credits - debits)
    const balance =
      (totalCredits._sum.amount || 0) - (totalDebits._sum.amount || 0);

    return balance;
  } catch (error) {
    throw new HttpError({
      code: 500,
      success: false,
      message: "Failed to calculate account balance",
      error: error,
    });
  }
};

export const updateAccountBalance = async (
  accountId: string,
  amount: number,
  type: TransactionType
) => {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  const newBalance =
    type === "DEBIT"
      ? (account?.balance ?? 0) - amount
      : (account?.balance ?? 0) + amount;

  await prisma.account.update({
    where: { id: accountId },
    data: { balance: newBalance },
  });
};

export const getTransactionsByAccount = async (accountId: string) => {
  return await prisma.transaction.findMany({
    where: { accountId },
    orderBy: { createdAt: "desc" },
  });
};

export const sumAccountTransactions = async (accountId: string) => {
  const totalCredits = await prisma.transaction.aggregate({
    where: { accountId, type: "CREDIT" },
    _sum: { amount: true },
  });

  const totalDebits = await prisma.transaction.aggregate({
    where: { accountId, type: "DEBIT" },
    _sum: { amount: true },
  });

  return { totalCredits, totalDebits };
};

// Accounting Periods

// Create a new period
export async function createPeriod(
  startDate: Date,
  endDate: Date,
  workspaceId: string
) {
  const newPeriod = await prisma.period.create({
    data: {
      startDate,
      endDate,
      isClosed: false,
      workspaceId: workspaceId,
    },
  });
  return newPeriod;
}

// Update an existing period
export async function updatePeriod(
  id: string,
  data: Partial<{ startDate: Date; endDate: Date; isClosed: boolean }>
) {
  const updatedPeriod = await prisma.period.update({
    where: { id },
    data,
  });
  return updatedPeriod;
}

// Fetch all periods
export async function getAllPeriods() {
  const periods = await prisma.period.findMany({
    orderBy: {
      startDate: "asc",
    },
  });
  return periods;
}

// Fetch a specific period by ID
export async function getPeriodById(id: string) {
  const period = await prisma.period.findUnique({
    where: { id },
  });
  return period;
}

// Fetch all open periods
export async function getOpenPeriods() {
  const openPeriods = await prisma.period.findMany({
    where: { isClosed: false },
    orderBy: {
      startDate: "asc",
    },
  });
  return openPeriods;
}

// Close a specific period
export async function closePeriod(id: string) {
  const closedPeriod = await prisma.period.update({
    where: { id },
    data: { isClosed: true },
  });
  return closedPeriod;
}

// Delete a period (if not closed)
export async function deletePeriod(id: string) {
  const period = await prisma.period.findUnique({ where: { id } });
  if (period?.isClosed) {
    throw new HttpError({
      code: 400,
      success: false,
      message: "Cannot delete a closed period.",
    });
  }
  const deletedPeriod = await prisma.period.delete({
    where: { id },
  });
  return deletedPeriod;
}

// 7. Get Smallest Period a Date Falls Within
export async function getSmallestPeriodByDate(date: Date, workspaceId: string) {
  return await prisma.period.findFirst({
    where: {
      startDate: { lte: date },
      endDate: { gte: date },
      workspaceId,
    },
    orderBy: {
      endDate: "asc", // Get the smallest period (the one ending soonest)
    },
  });
}

// Reimbursement

//Create a reimbursement
export async function createReimbursement(data: {
  amount: number;
  description: string;
  workspaceId: string;
  createdBy: string;
  accountId: string;
  userId: string;
  date: Date;
}) {
  // Step 1: Find the smallest period that contains the reimbursement date
  const period = await getSmallestPeriodByDate(data.date, data.workspaceId);

  if (!period) {
    throw new HttpError({
      code: 400,
      success: false,
      message: "No applicable period found for the given date.",
    });
  }

  // Create journal entry first
  const journalEntry = await prisma.journalEntry.create({
    data: {
      description: `Reimbursement for ${data.description}`,
      createdBy: data.createdBy,
      workspaceId: data.workspaceId,
      periodId: period.id,
      transactions: {
        create: [
          {
            amount: data.amount,
            type: "DEBIT",
            accountId: data.accountId,
            workspaceId: data.workspaceId,
            note: data.description,
            accountType: "EXPENSE", // Changed from ASSET to EXPENSE for reimbursements
          },
        ],
      },
    },
  });

  // Create the reimbursement record
  const reimbursement = await prisma.reimbursement.create({
    data: {
      amount: data.amount,
      description: data.description,
      workspaceId: data.workspaceId,
      createdBy: data.createdBy,
      userId: data.userId,
      journalEntryId: journalEntry.id,
      accountId: data.accountId,
    },
  });

  return reimbursement;
}

// Get all reimbursements
export async function getReimbursements(workspaceId: string) {
  return await prisma.reimbursement.findMany({
    where: { workspaceId },
  });
}

// update reimbursement
export async function updateReimbursement(
  id: string,
  data: Partial<Reimbursement>
) {
  return await prisma.reimbursement.update({
    where: { id },
    data: {
      amount: data.amount,
      description: data.description,
      status: data.status,
    },
  });
}
// Delete a reimbursement
export async function deleteReimbursement(id: string) {
  const reimbursement = await prisma.reimbursement.findUnique({
    include: {
      journalEntry: true,
    },
    where: { id },
  });

  // Optionally delete associated journal entry if exists
  if (reimbursement?.journalEntryId) {
    await prisma.journalEntry.delete({
      where: { id: reimbursement.journalEntryId },
    });
  }

  return await prisma.reimbursement.delete({
    where: { id },
  });
}

// Journal Entries

// Create Journal Entry
interface CreateJournalEntryInput {
  description: string;
  transactions: {
    amount: number;
    type: TransactionType;
    fromAccountId: string;
    toAccountId: string;
    note: string;
    accountType: AccountType;
    relatedTransactionId?: string;
    itemId?: string;
  };
  workspaceId: string;
  createdBy: string;
  dateOfEntry: Date;
}

export async function createJournalEntry({
  description,
  transactions,
  dateOfEntry,
  workspaceId,
  createdBy,
}: CreateJournalEntryInput) {
  // Find or create period
  let period = await getSmallestPeriodByDate(dateOfEntry, workspaceId);

  if (!period) {
    const startOfTheMonth = new Date(
      dateOfEntry.getFullYear(),
      dateOfEntry.getMonth(),
      1
    );
    const endOfTheMonth = new Date(
      dateOfEntry.getFullYear(),
      dateOfEntry.getMonth() + 1,
      0
    );

    period = await createPeriod(startOfTheMonth, endOfTheMonth, workspaceId);
  }

  // Create journal entry with transactions
  const journalEntry = await prisma.$transaction(async (prisma) => {
    const entry = await prisma.journalEntry.create({
      data: {
        description,
        createdBy,
        workspaceId,
        periodId: period.id,
        date: dateOfEntry,
        transactions: {
          create: {
            amount: transactions.amount,
            type: transactions.type,
            fromAccountId: transactions.fromAccountId,
            toAccountId: transactions.toAccountId,
            workspaceId,
            note: transactions.note,
            accountType: transactions.accountType,
            relatedTransactionId: transactions.relatedTransactionId,
            itemId: transactions.itemId,
          },
        },
      },
      include: { transactions: true },
    });

    return entry;
  });

  return journalEntry;
}

// Retrieve Journal Entries
export async function getJournalEntries({
  page = 1,
  limit = 10,
  workspaceId,
  periodId,
  entryDate,
  searchQuery,
}: {
  page: number;
  limit: number;
  workspaceId: string;
  periodId?: string;
  entryDate?: Date;
  searchQuery?: string;
}) {
  const offset = (page - 1) * limit;

  // Prepare the filtering conditions
  const filters: any = {
    workspaceId,
  };

  if (periodId) {
    filters.periodId = periodId;
  }

  if (entryDate) {
    filters.createdAt = {
      equals: entryDate,
    };
  }

  if (searchQuery) {
    filters.OR = [
      {
        transactions: {
          some: { note: { contains: searchQuery, mode: "insensitive" } },
        },
      },
      {
        createdByUser: { name: { contains: searchQuery, mode: "insensitive" } },
      },
    ];
  }

  // Fetch journal entries and count for pagination
  const [journalEntries, totalCount] = await Promise.all([
    prisma.journalEntry.findMany({
      where: filters,
      include: {
        transactions: {
          include: {
            account: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        period: true,
        workspace: true,
        createdByUser: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      skip: offset, // Pagination: Skip the offset number of records
      take: limit, // Pagination: Limit the number of records fetched
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
    }),
    prisma.journalEntry.count({
      where: filters, // Count the total number of matching journal entries
    }),
  ]);

  return { journalEntries, totalCount };
}

//Retrieve Single Journal Entry
export async function getJournalEntryById(id: string) {
  const journalEntry = await prisma.journalEntry.findUnique({
    where: { id },
    include: {
      transactions: true,
      period: true,
      workspace: true,
      createdByUser: true,
    },
  });

  if (!journalEntry) {
    throw new HttpError({
      code: 404,
      success: false,
      message: `Journal entry with ID ${id} not found`,
    });
  }

  return journalEntry;
}

//Update Journal Entry
interface UpdateJournalEntryInput {
  description?: string;
  accountId?: string;
  periodId?: string;
  transactions?: {
    amount: number;
    type: TransactionType;
    accountId: string;
    note: string;
  }[];
  workspaceId: string;
}

export async function updateJournalEntry(
  id: string,
  data: UpdateJournalEntryInput
) {
  if (data.periodId) {
    const period = await prisma.period.findUnique({
      where: { id: data.periodId },
    });

    if (period && period.isClosed) {
      throw new HttpError({
        code: 400,
        success: false,
        message: "Cannot update journal entry for a closed period",
      });
    }
  }

  const updatedJournalEntry = await prisma.journalEntry.update({
    where: { id },
    data: {
      description: data.description,
      periodId: data.periodId,
      transactions: data.transactions && {
        deleteMany: {},
        create: data.transactions.map((t) => ({
          amount: t.amount,
          type: t.type,
          accountId: t.accountId,
          note: t.note,
          workspaceId: data.workspaceId, // Add this line
        })),
      },
    },
    include: { transactions: true },
  });

  return updatedJournalEntry;
}

// Delete Journal Entry
export async function deleteJournalEntry(id: string) {
  const deletedJournalEntry = await prisma.journalEntry.delete({
    where: { id },
  });

  return deletedJournalEntry;
}

// Add Transaction to Journal Entry
interface AddTransactionInput {
  amount: number;
  type: TransactionType;
  accountId: string;
  workspaceId: string;
  note: string;
}

export async function addTransactionToJournalEntry(
  journalEntryId: string,
  transactionData: AddTransactionInput
) {
  const newTransaction = await prisma.transaction.create({
    data: {
      amount: transactionData.amount,
      type: transactionData.type,
      accountId: transactionData.accountId,
      journalEntryId,
      workspaceId: transactionData.workspaceId,
      note: transactionData.note,
    },
  });

  return newTransaction;
}
// Associate Reimbursement with Journal Entry
interface CreateReimbursementWithJournalEntryInput {
  description: string;
  amount: number;
  accountId: string;
  workspaceId: string;
  userId: string;
  periodId: string;
}

export async function createReimbursementWithJournalEntry({
  description,
  amount,
  workspaceId,
  userId,
  periodId,
  accountId,
}: CreateReimbursementWithJournalEntryInput) {
  // Create journal entry for the reimbursement
  const journalEntry = await prisma.journalEntry.create({
    data: {
      description: `Reimbursement for ${description}`,
      createdBy: userId,
      workspaceId,
      periodId,
      transactions: {
        create: [
          {
            amount: amount,
            type: "DEBIT", // Reimbursement reduces an account balance
            workspaceId,
            note: description,
            accountId: "some-cash-account-id", // Specify the cash account
          },
          {
            amount: amount,
            type: "CREDIT", // Opposing transaction for accounting
            accountId: "some-cash-account-id", // Specify the cash account
            workspaceId,
            note: description,
          },
        ],
      },
    },
  });

  // Create the reimbursement and associate it with the journal entry
  const reimbursement = await prisma.reimbursement.create({
    data: {
      description,
      amount,
      status: "PENDING",
      accountId,
      workspaceId,
      journalEntryId: journalEntry.id,
      createdBy: userId,
    },
  });

  return { journalEntry, reimbursement };
}

// export async function getAllTransactions({
//   page = 1,
//   limit = 10,
//   workspaceId,
// }: {

// }) {

//     // Calculate the offset for pagination
//     const offset = (page - 1) * limit;

//     const [transactions, totalCount] = await Promise.all([
//       prisma.transaction.findMany({
//         where: {
//           workspaceId,
//         },
//         orderBy: {
//           createdAt: "desc", // Order by creation date, newest first
//         },
//         include: {
//           account: true, // Include related account details
//           journalEntry: true, // Include related journal entry details
//           workspace: true, // Include related workspace details
//         },
//         skip: offset, // Skip the number of records for pagination
//         take: limit, // Limit the number of records fetched
//     }),
//     prisma.transaction.count({
//       where: {
//         workspaceId,
//       },
//     }), // Get total count of transactions for pagination info
//   ]);

//   return { transactions, totalCount };
// }

// Customer Management

export async function createCustomer(
  id: string,
  name: string,
  email: string,
  workspaceId: string,
  address: Omit<
    Address,
    "createdAt" | "updatedAt" | "id" | "customerId" | "vendorId"
  >[],
  phone?: string
) {
  const customer = await prisma.customer.create({
    include: {
      invoices: true,
      accountsReceivable: true,
      Address: true,
      payments: true,
    },
    data: {
      name,
      email,
      phone,
      Address: {
        create: address,
      },
      workspace: {
        connect: { id: workspaceId }, // Assuming you're passing workspaceId contextually
      },
    },
  });

  return customer;
}

export async function getAllCustomers(workspaceId: string) {
  return await prisma.customer.findMany({
    where: {
      workspaceId,
    },
    include: {
      Address: true,
      accountsReceivable: true,
      invoices: true,
      payments: true,
    },
  });
}

export async function getCustomerById(customerId: string) {
  return await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      accountsReceivable: true,
      invoices: true,
    },
  });
}

export async function updateCustomer(
  customerId: string,
  data: { name?: string; email?: string; phone?: string; address?: string }
) {
  return await prisma.customer.update({
    where: { id: customerId },
    data,
  });
}

export async function deleteCustomer(customerId: string) {
  return await prisma.customer.delete({
    where: { id: customerId },
  });
}

//Managing Accounts Receivable

export async function createAccountsReceivable(
  customerId: string,
  initialBalance: number = 0,
  workspaceId: string
) {
  return await prisma.accountsReceivable.create({
    data: {
      customerId,
      balance: initialBalance,
      workspaceId,
    },
  });
}

export async function getAccountsReceivableByCustomer(customerId: string) {
  return await prisma.accountsReceivable.findMany({
    where: { customerId },
    include: {
      arTransactions: true,
      Invoice: true,
      Payment: true,
    },
  });
}

export async function updateAccountsReceivableBalance(
  arId: string,
  adjustment: number
) {
  // Fetch existing AR balance
  // const ar = await prisma.accountsReceivable.findUnique({ where: { id: arId } });

  // if (!ar) throw new Error('Accounts Receivable not found');

  // Update the balance
  return await prisma.accountsReceivable.update({
    where: { id: arId },
    data: {
      balance: {
        ...(adjustment > 0
          ? { increment: adjustment }
          : { decrement: adjustment }),
      },
    },
  });
}

//Managing Invoices and Payments
export async function createInvoice(
  customerId: string,
  totalAmount: number,
  dueDate: Date
) {
  return await prisma.invoice.create({
    data: {
      customerId,
      totalAmount,
      status: "PENDING",
      dueDate,
      accountsReceivable: {
        connect: {
          customerId,
        },
      },
    },
  });
}

export async function createPayment(
  customerId: string,
  amount: number,
  method: string,
  workspaceId: string
) {
  const payment = await prisma.payment.create({
    data: {
      customerId,
      amount,
      method: method as PaymentMethod,
      accountsReceivable: {
        connect: {
          customerId,
        },
      },
      workspaceId,
    },
  });

  // Update AR balance
  await updateAccountsReceivableBalance(
    payment.accountsReceivableId as string,
    -amount
  );
  return payment;
}

export async function getInvoicesByCustomer(customerId: string) {
  return await prisma.invoice.findMany({
    where: { customerId },
    include: {
      payments: true, // Include related payments
    },
  });
}

//Managing AR Transactions

export async function addARTransaction(
  arId: string,
  type: string,
  amount: number,
  description?: string
) {
  return await prisma.aRTransaction.create({
    data: {
      accountsReceivableId: arId,
      type: type as ARTransactionType,
      amount,
      description,
    },
  });
}

export async function getARTransactionsByCustomer(customerId: string) {
  return await prisma.aRTransaction.findMany({
    where: { accountsReceivable: { customerId } },
    include: {
      accountsReceivable: true,
    },
  });
}

// Vendor Management
export async function addVendor(
  name: string,
  email: string,
  contactPerson: string,
  workspaceId: string,
  address: Omit<
    Address,
    "createdAt" | "updatedAt" | "id" | "customerId" | "vendorId"
  >[],
  phone?: string
) {
  return await prisma.vendor.create({
    include: {
      invoices: true,
      accountsPayable: true,
      Address: true,
      payments: true,
    },
    data: {
      name,
      email,
      contactPerson,
      phone,
      Address: {
        create: address,
      },
      workspace: {
        connect: { id: workspaceId }, // Assuming you're passing workspaceId contextually
      },
    },
  });
}

export async function getVendors(workspaceId: string) {
  return await prisma.vendor.findMany({
    include: {
      invoices: true,
      payments: true,
      Address: true,
      accountsPayable: true,
    },
    where: { workspaceId },
  });
}

export async function getVendorsMetadata(workspaceId: string) {
  return await prisma.vendor.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
    where: { workspaceId },
  });
}

export async function updateVendor(id: string, data: Partial<Vendor>) {
  return await prisma.vendor.update({
    where: { id },
    data,
  });
}

export async function deleteVendor(id: string) {
  return await prisma.vendor.delete({
    where: { id },
  });
}

export async function getVendorsById(vendorId: string) {
  return await prisma.vendor.findMany({
    where: { id: vendorId },
    include: {
      invoices: true,
      payments: true,
    },
  });
}

// export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
//   return await prisma.invoice.update({
//     where: { id },
//     data: { status },
//   });
// }

//Payments

export async function recordPayment(data: {
  amount: number;
  method: PaymentMethod;
  customerId: string;
  invoiceId?: string;
  accountsReceivableId?: string;
  vendorId: string;
  workspaceId: string;
}) {
  return await prisma.payment.create({
    data,
  });
}

export async function getPayments(workspaceId: string) {
  return await prisma.payment.findMany({
    where: { workspaceId },
    include: {
      invoice: true,
      Vendor: true,
    },
  });
}

export async function getOverdueInvoices(workspaceId: string) {
  return await prisma.invoice.findMany({
    where: {
      workspaceId,
      status: "OVERDUE",
    },
    include: {
      Vendor: true,
    },
  });
}

// Employee Management
//Create Employee
export async function createEmployee(data: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  baseSalary: number;
  departmentId: string;
  roleId: string;
  startDate: Date;
  workspaceId: string;
  dateOfBirth: Date;
  employmentStatus: EmploymentStatus;
  maritalStatus: MaritalStatus;
  NRA_Tin_Number?: string;
  NIN_Number?: string;
  contactPersonName: string;
  contactPersonPhone: string;
}) {
  // calculate tax based on base salary
  // baseSalary
  const employee = await prisma.employee.create({
    data: {
      dateOfBirth: new Date(data.dateOfBirth),
      email: data.email,
      employmentStatus: data.employmentStatus,
      firstName: data.firstName,
      lastName: data.lastName,
      contactPersonName: data.contactPersonName,
      contactPersonPhone: data.contactPersonPhone,
      startDate: new Date(data.startDate),
      workspaceId: data.workspaceId,
      departmentId: data.departmentId,
      roleId: data.roleId,
      maritalStatus: data.maritalStatus,
      NRA_Tin_Number: data.NRA_Tin_Number,
      NIN_Number: data.NIN_Number,
    },
  });

  return await updateEmployeeSalary(
    employee.id,
    data.workspaceId,
    data.baseSalary
  );
}
export async function uploadEmployeeFiles(
  uploadedFiles: Omit<UploadFile, "id">[]
) {
  return prisma.uploadFile.createMany({
    data: uploadedFiles,
  });
}

//Update Employee
export async function updateEmployee(
  employeeId: string,
  data: Partial<Employee>
) {
  return await prisma.employee.update({
    where: { id: employeeId },
    data,
  });
}

//Get Employee List
export async function getAllEmployees(workspaceId: string) {
  return await prisma.employee.findMany({
    include: {
      Department: {
        include: {
          Role: true,
        },
      },
      Role: true,
      salary: true,
      Benefit: true,
      Deduction: true,
      UploadFile: true,
    },
    where: { workspaceId },
  });
}
//Get an Employee
export async function getEmployee(id: string) {
  return await prisma.employee.findUnique({
    include: {
      Department: {
        include: {
          Role: true,
        },
      },
      Role: true,
      SalaryHistory: true,
      BenefitHistory: true,
      salary: true,
      Benefit: true,
      Deduction: true,
    },
    where: { id },
  });
}
//Delete Employee
export async function deleteEmployee(id: string) {
  return await prisma.employee.delete({
    where: { id },
  });
}

//Assign Employee Benefit
export async function assignEmployeeBenefit(data: Omit<Benefit, "id">) {
  let benefitCalculationJson = {};
  if (data.isTaxable) {
    benefitCalculationJson = calculateTax(data.value);
  }
  return await prisma.benefit.create({
    data: {
      ...data,
      benefitCalculationJson: benefitCalculationJson as any,
    },
  });
}

// Remove Employee Benifit
export async function removeEmployeeBenefit(benefitId: string) {
  return await prisma.benefit.delete({
    where: { id: benefitId },
  });
}

// Assign Employee Deduction
export async function assignEmployeeDeduction(data: Omit<Deduction, "id">) {
  return await prisma.deduction.create({
    data,
  });
}
// Remove Employee Deduction
export async function removeEmployeeDeduction(deductionId: string) {
  return await prisma.deduction.delete({
    where: { id: deductionId },
  });
}

// Salary Management

// Set Employee Salary
export async function updateEmployeeSalary(
  employeeId: string,
  workspaceId: string,
  basicSalary: number
) {
  const existingUser = await prisma.employee.findFirst({
    include: {
      salary: true,
      Benefit: true,
      Deduction: true,
    },
    where: { id: employeeId },
  });

  if (!existingUser) {
    throw new HttpError({
      code: 404,
      success: false,
      message: "Employee not found",
    });
  }

  const totalBenefit = existingUser.Benefit.filter(
    (benefit) => benefit.isTaxable
  ).reduce((acc, curr) => acc + curr.value, 0);

  const totalDeductions = existingUser.Deduction.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  // calculating salary after tax
  const salaryCalculation = calculateTax(
    basicSalary + totalBenefit - totalDeductions
  );

  if (existingUser.salary) {
    // if the user already has salary add that salary to salary history
    await prisma.salaryHistory.create({
      data: {
        employeeId,
        baseSalary: existingUser.salary.basicSalary,
        salaryCalculationJson: existingUser.salary.salaryCalculationJson as any,
        lastEffectiveDate: new Date(),
      },
    });
  }
  const netSalary =
    salaryCalculation.gross -
    salaryCalculation.totalTax -
    salaryCalculation.nassit;

  const createdSalary = await prisma.salary.create({
    data: {
      employeeId,
      workspaceId,
      salaryCalculationJson: salaryCalculation,
      basicSalary: Number.parseFloat(`${basicSalary}`),
      NASSIT: salaryCalculation.nassit,
      tax: salaryCalculation.totalTax,
      netSalary: Number.parseFloat(`${netSalary}`),
    },
  });

  return await prisma.employee.update({
    include: {
      salary: true,
      Benefit: true,
      Deduction: true,
    },
    where: { id: existingUser.id },
    data: {
      salary: {
        connect: {
          id: createdSalary.id,
        },
      },
    },
  });
}
// Set Employee Salary
export async function recalculateEmployeeSalary(employeeId: string) {
  const existingUser = await prisma.employee.findFirst({
    include: {
      salary: true,
      Benefit: true,
      Deduction: true,
    },
    where: { id: employeeId },
  });

  if (!existingUser || !existingUser.salary) {
    throw new HttpError({
      code: 404,
      success: false,
      message: "Employee Salary not found : please update salary first",
    });
  }

  const totalBenefit = existingUser.Benefit.filter(
    (benefit) => benefit.isTaxable
  ).reduce((acc, curr) => acc + curr.value, 0);

  const totalDeductionBeforeTax = existingUser.Deduction.filter(
    (deduction) => !deduction.isTaxExempt
  ).reduce((acc, curr) => acc + curr.amount, 0);

  const totalDeductionAfterTax = existingUser.Deduction.filter(
    (deduction) => deduction.isTaxExempt
  ).reduce((acc, curr) => acc + curr.amount, 0);

  // calculating salary after tax
  const salaryCalculation = calculateTax(
    existingUser.salary.basicSalary + totalBenefit - totalDeductionBeforeTax
  );

  console.log(salaryCalculation);
  const netSalary =
    salaryCalculation.gross -
    salaryCalculation.totalTax -
    salaryCalculation.nassit;

  return await prisma.salary.update({
    where: { id: existingUser.salary.id },
    data: {
      employeeId,
      workspaceId: existingUser.workspaceId,
      salaryCalculationJson: salaryCalculation,
      basicSalary: Number.parseFloat(`${existingUser.salary.basicSalary}`),
      NASSIT: salaryCalculation.nassit,
      tax: salaryCalculation.totalTax,
      netSalary: Number.parseFloat(`${netSalary}`) - totalDeductionAfterTax,
    },
  });

  //  prisma.employee.update({
  //     include: {
  //       salary: true,
  //       Benefit: true,
  //       Deduction: true,
  //     },
  //     where: { id: existingUser.id },
  //     data: {
  //       salary: {
  //         connect: {
  //           id: createdSalary.id,
  //         },
  //       },
  //     },
  //   });
}

// Process Payroll for All Employees
export async function generatePayroll(
  workspaceId: string,
  payrollDate: Date,
  paymentMode: PaymentMode,
  excludedEmployees: string[]
) {
  // Fetch all active employees in the specified workspace
  const employees = await prisma.employee.findMany({
    where: { workspaceId },
    include: {
      salary: true,
      payrollItems: true,
      Deduction: true,
      Benefit: true,
    },
  });

  // Iterate over each employee to calculate payroll
  const payrollRecords = await Promise.all(
    employees
      .filter((employee) => !excludedEmployees.includes(employee.id))
      .map(async (employee) => {
        if (!employee.salary) {
          throw new Error(`Employee ${employee.id} has no salary record.`);
        }

        // const netSalary =
        // salaryCalculation.gross -
        // salaryCalculation.totalTax -
        // salaryCalculation.nassit;

        const {
          basicSalary,
          // deductionsBeforTax,
          // deductionsAfterTax,
          // bonusBeforTax,
          // bonusAfterTax,
          // tax,
          // NASSIT,
        } = employee.salary;

        const preTaxBonus = employee.Benefit.filter(
          (benefit) => benefit.isTaxable
        ).reduce((acc, curr) => acc + curr.value, 0);

        const afterTaxBonus = employee.Benefit.filter(
          (benefit) => !benefit.isTaxable
        ).reduce((acc, curr) => acc + curr.value, 0);

        const preTaxDeduction = employee.Deduction.filter(
          (deduction) => !deduction.isTaxExempt
        ).reduce((acc, curr) => acc + curr.amount, 0);

        const afterTaxDeduction = employee.Deduction.filter(
          (deduction) => deduction.isTaxExempt
        ).reduce((acc, curr) => acc + curr.amount, 0);

        // calculating salary after tax
        const salaryCalculation = calculateTax(
          employee.salary.basicSalary + preTaxBonus - preTaxDeduction
        );

        // Calculate total deductions and bonuses
        const totalDeductions =
          preTaxDeduction +
          afterTaxDeduction +
          salaryCalculation.totalTax +
          salaryCalculation.nassit;

        const totalBonuses = afterTaxBonus + afterTaxBonus;

        // Calculate net salary
        const grossSalary = basicSalary + totalBonuses;
        const netSalary = grossSalary - totalDeductions;

        // Create payroll item record
        return await prisma.payrollItem.create({
          data: {
            employeeId: employee.id,
            salaryId: employee.salary.id,
            month: payrollDate.getMonth() + 1,
            year: payrollDate.getFullYear(),
            totalPaid: netSalary,
            paymentDate: payrollDate,
            basicSalary,
            grossSalary,
            netSalary,
            deductions: totalDeductions,
            bonuses: totalBonuses,
            paymentMode,
            workspaceId,
          },
        });
      })
  );

  return payrollRecords;
}

export async function getPayroll(
  workspaceId: string,
  startDate?: Date,
  endDate?: Date,
  departmentId?: string
) {
  const whereClause: any = { workspaceId };

  if (startDate && endDate) {
    whereClause.date = { gte: startDate, lte: endDate };
  }

  if (departmentId) {
    whereClause.employee = { departmentId };
  }

  const payrollItems = await prisma.payrollItem.findMany({
    where: whereClause,
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          department: true,
        },
      },
    },
  });

  return payrollItems;
}

//  Tax and Deduction Management
export async function addTaxBracket(data: {
  description: string;
  lowerLimit: number;
  upperLimit: number;
  taxPercentage: number;
  workspaceId: string;
}) {
  return await prisma.taxBracket.create({
    data,
  });
}

// Get Applicable Tax for a Salary
export async function getTaxForSalary(salary: number) {
  const taxBracket = await prisma.taxBracket.findFirst({
    where: {
      AND: [{ lowerLimit: { lte: salary } }, { upperLimit: { gte: salary } }],
    },
  });

  return taxBracket ? taxBracket.taxPercentage : 0;
}

// Add Deduction for Employee
export async function addDeduction(
  employeeId: string,
  workspaceId: string,
  deduction: {
    name: string;
    description?: string;
    amount: number;
    isTaxExempt: boolean;
  }
) {
  return await prisma.deduction.create({
    data: {
      employeeId,
      ...deduction,
      workspaceId,
    },
  });
}

// Generate Payroll Report for a Specific Month
export async function generatePayrollReport(month: number, year: number) {
  const payrollReport = await prisma.payrollItem.findMany({
    where: {
      month,
      year,
    },
    include: {
      employee: true,
      salary: true,
    },
  });

  return payrollReport;
}

// Payment Management

// Record Salary Payment
export async function recordSalaryPayment(
  payrollId: string,
  paymentMode: "BANK_TRANSFER" | "CASH" | "CHEQUE" | "MOBILE_PAYMENT"
) {
  return await prisma.payrollItem.update({
    where: { id: payrollId },
    data: {
      paymentMode,
      paymentDate: new Date(),
    },
  });
}

// Employee Leave and Benefits (Optional)
// Add Employee Leave
export async function addEmployeeLeave(
  employeeId: string,
  workspaceId: string,
  leaveData: {
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
  }
) {
  return await prisma.leave.create({
    data: {
      employeeId,
      ...leaveData,
      workspaceId,
    },
  });
}

export async function updateLeave(leaveId: string, status: LeaveStatus) {
  return await prisma.leave.update({
    where: { id: leaveId },
    data: { status },
  });
}

// Get Pending Leaves
export async function getPendingLeaves() {
  return await prisma.leave.findMany({
    where: { status: "PENDING" },
    include: { employee: true },
  });
}

// Department server action
// Create a Department
export async function createDepartment(
  name: string,
  workspaceId: string,
  description?: string
) {
  const department = await prisma.department.create({
    data: {
      name,
      description,
      workspaceId,
    },
  });
  return department;
}

// Read all Departments
export async function getDepartments(workspaceId: string) {
  const departments = await prisma.department.findMany({
    where: { workspaceId },
    include: {
      Role: true, // Optional: Include associated roles
    },
  });
  return departments;
}

// Update a Department
export async function updateDepartment(
  id: string,
  name: string,
  description?: string
) {
  const updatedDepartment = await prisma.department.update({
    where: { id },
    data: {
      name,
      description,
    },
  });
  return updatedDepartment;
}

// Delete a Department
export async function deleteDepartment(id: string) {
  const deletedDepartment = await prisma.department.delete({
    where: { id },
  });
  return deletedDepartment;
}

// Create a Role
export async function createRole(
  title: string,
  level: number = 1,
  workspaceId: string,
  departmentId: string
) {
  const role = await prisma.role.create({
    include: {
      department: true,
    },
    data: {
      title,
      level,
      workspaceId,
      departmentId,
    },
  });

  return role;
}

// Read all Roles
export async function getRoles(workspaceId: string) {
  const roles = await prisma.role.findMany({
    where: { workspaceId },
    include: {
      department: true, // Optional: Include associated department
    },
  });
  return roles;
}

// Update a Role
export async function updateRole(
  id: string,
  title: string,
  departmentId?: string
) {
  const updatedRole = await prisma.role.update({
    include: {
      department: true,
    },
    where: { id },
    data: {
      title,
      departmentId,
    },
  });
  return updatedRole;
}

// Delete a Role
export async function deleteRole(id: string) {
  const deletedRole = await prisma.role.delete({
    where: { id },
  });
  return deletedRole;
}

// Invontary

export async function createInventoryItem(
  data: {
    inventoryItem: Omit<
      InventoryItem,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "accountId"
      | "workspaceId"
      | "quantity"
      | "reorderLevel"
      | "fullyPaid"
      | "fullyDepreciated"
      | "salvageValue"
    >;
    isCredit: boolean;
    vendor: { id: string; email: string; name: string; phone: string } | null;
  },
  inventoryId: string,
  workspaceId: string
) {
  const accountNumber =
    INVENTORY_CATEGORY_ACCOUNTS[data.inventoryItem.category];

  const currentAssetAccount = await prisma.account.findFirst({
    where: { number: accountNumber },
  });

  if (!currentAssetAccount) {
    throw new HttpError({
      code: 404,
      success: false,
      message: "Current Asset Account not found",
    });
  }

  const totalInventoryItemCost =
    data.inventoryItem.quantityInStock * data.inventoryItem.purchasePrice;

  // Handle vendor and accounts payable
  if (data.vendor && data.isCredit) {
    await prisma.accountsPayable.create({
      data: {
        account: { connect: { id: currentAssetAccount.id } },
        vendor: { connect: { id: data.vendor.id } },
        workspaceId,
      },
    });

    await debitAccount(currentAssetAccount.id, totalInventoryItemCost);
  }

  // Create inventory item
  return await prisma.inventoryItem.create({
    data: {
      id: inventoryId,
      ...data.inventoryItem,
      accountId: currentAssetAccount.id,
      workspaceId,
      supplierId: data.vendor?.id,
      quantity: data.inventoryItem.quantityInStock,
      fullyPaid: !data.isCredit,
      fullyDepreciated: false,
      salvageValue: 0,
    },
  });
}

export async function getInventoryItems(workspaceId: string) {
  const inventory = await prisma.inventoryItem.findMany({
    where: {
      workspaceId,
    },
  });
  return inventory;
}
export async function reorderInventoryItem(id: string, quantity: number) {
  return await prisma.inventoryItem.update({
    where: { id },
    data: {
      quantity: { increment: quantity },
    },
  });
}

export async function getInventoryAssetsAccount() {
  return await prisma.account.findFirst({
    where: { name: "Inventory Assets" },
  });
}

// export async function updateInventoryItem(id: string, data: Omit<InventoryItem, "id"|"createdAt"|"updatedAt">) {
//   return await prisma.inventoryItem.update({
//     where: { id },
//     data,
//   });
// }
