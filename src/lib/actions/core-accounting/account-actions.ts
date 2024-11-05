
"use server";
import {
  createAccount,
  getAccountById,
  updateAccount,
  deleteAccount,
  calculateAccountBalance,
  getAccounts,
} from "@/module/CoreAccountingModule"; // Path to the service layer
import { AccountType } from "@prisma/client";

// Server action to create an account
export async function createAccountAction(data: {
  name: string;
  number: string;
  type: AccountType;
  parentAccountId?: string;
  workspaceId: string;
  balance?: number;
}) {
  const account = await createAccount(data);
  return { account };
}

// Server action to get account by ID
export async function getAccountByIdAction(accountId: string) {
  const account = await getAccountById(accountId);
  if (!account) {
    return { error: "Account not found" };
  }
  return { account };
}

// Server action to get all accounts
export async function getAccountsAction() {
  const accounts = await getAccounts();
  return { accounts };
}

// Server action to update an account
export async function updateAccountAction(
  accountId: string,
  data: {
    name?: string;
    number?: string;
    type?: AccountType;
    parentAccountId?: string;
    workspaceId?: string;
    balance?: number;
  }
) {
  const account = await updateAccount(accountId, data);
  return { account };
}

// Server action to delete an account
export async function deleteAccountAction(accountId: string) {
  const account = await deleteAccount(accountId);
  return { account };
}

// Server action to calculate account balance
export async function calculateAccountBalanceAction(accountId: string) {
  const balance = await calculateAccountBalance(accountId);
  return { balance };
}
