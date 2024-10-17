import { HttpError } from "@/utils/errorHandler";
import {
  AccountType,
  PrismaClient,
  AccountStatus,
  TransactionType,
} from "@prisma/client";

const prisma = new PrismaClient();
// creating account
export const createAccount = async (accountData: {
  name: string;
  number: string;
  type: AccountType;
  balance?: number;
  parentAccountId?: string; // optional parent account
}) => {
  try {
    const account = await prisma.account.create({
      data: {
        name: accountData.name,
        number: accountData.number,
        type: accountData.type,
        balance: accountData.balance || 0,
        parentAccountId: accountData.parentAccountId || null,
      },
    });
    return account;
  } catch (error) {
    throw new HttpError({
      code: 500,
      success: false,
      message: "Failed to create account",
      error: error,
    });
  }
};

export const getAccountById = async (id:string) => {
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

  
export const getAccounts = async () => {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        subAccounts: true, // include sub-accounts for hierarchy
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
      data: updateData,
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
