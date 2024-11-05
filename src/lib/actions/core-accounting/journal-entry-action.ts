"use server";

import {
  addTransactionToJournalEntry,
  createJournalEntry,
  createReimbursement,
  createReimbursementWithJournalEntry,
  deleteJournalEntry,
  deleteReimbursement,
  getJournalEntries,
  getJournalEntryById,
  getReimbursements,
  updateJournalEntry,
  updateReimbursement,
} from "@/module/CoreAccountingModule";

import { Reimbursement, TransactionType } from "@prisma/client";

// Journal Entry Actions
export async function createJournalEntryAction(data: {
  description: string;
  transactions: {
    amount: number;
    type: TransactionType;
    accountId: string;
    note: string;
    relatedTransactionId: string;
    id: string;
  }[];
  workspaceId: string;
  createdBy: string;
  dateOfEntry: Date;
}) {
  const journalEntry = await createJournalEntry(data);
  return { journalEntry };
}

export async function getJournalEntriesAction(params: {
  page: number;
  limit: number;
  workspaceId: string;
  periodId?: string;
  entryDate?: Date;
  searchQuery?: string;
}) {
  return await getJournalEntries(params);
}

export async function getJournalEntryByIdAction(id: string) {
  const journalEntry = await getJournalEntryById(id);
  return { journalEntry };
}

export async function updateJournalEntryAction(
  id: string,
  data: {
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
) {
  const updatedJournalEntry = await updateJournalEntry(id, data);
  return { updatedJournalEntry };
}

export async function deleteJournalEntryAction(id: string) {
  const deletedJournalEntry = await deleteJournalEntry(id);
  return { deletedJournalEntry };
}

export async function addTransactionToJournalEntryAction(
  journalEntryId: string,
  transactionData: {
    amount: number;
    type: TransactionType;
    accountId: string;
    workspaceId: string;
    note: string;
  }
) {
  const newTransaction = await addTransactionToJournalEntry(
    journalEntryId,
    transactionData
  );
  return { newTransaction };
}

// Reimbursement Actions
export async function createReimbursementAction(data: {
  amount: number;
  description: string;
  workspaceId: string;
  createdBy: string;
  accountId: string;
  userId: string;
  date: Date;
}) {
  const reimbursement = await createReimbursement(data);
  return { reimbursement };
}

export async function getReimbursementsAction(workspaceId: string) {
  const reimbursements = await getReimbursements(workspaceId);
  return { reimbursements };
}

export async function updateReimbursementAction(
  id: string,
  data: Partial<Reimbursement>
) {
  const updatedReimbursement = await updateReimbursement(id, data);
  return { updatedReimbursement };
}

export async function deleteReimbursementAction(id: string) {
  const deletedReimbursement = await deleteReimbursement(id);
  return { deletedReimbursement };
}

export async function createReimbursementWithJournalEntryAction(data: {
  description: string;
  amount: number;
  accountId: string;
  workspaceId: string;
  userId: string;
  periodId: string;
}) {
  const result = await createReimbursementWithJournalEntry(data);
  return {
    journalEntry: result.journalEntry,
    reimbursement: result.reimbursement,
  };
}
