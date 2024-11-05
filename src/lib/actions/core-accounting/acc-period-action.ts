
"use server";

import {
  createPeriod,
  updatePeriod,
  getAllPeriods,
  getPeriodById,
  getOpenPeriods,
  closePeriod,
  deletePeriod,

} from "@/module/CoreAccountingModule";


// Period Actions

export async function createPeriodAction(startDate: Date, endDate: Date, workspaceId: string) {
  const period = await createPeriod(startDate, endDate, workspaceId);
  return { period };
}

export async function updatePeriodAction(id: string, data: Partial<{ startDate: Date; endDate: Date; isClosed: boolean }>) {
  const period = await updatePeriod(id, data);
  return { period };
}

export async function getAllPeriodsAction() {
  const periods = await getAllPeriods();
  return { periods };
}

export async function getPeriodByIdAction(id: string) {
  const period = await getPeriodById(id);
  return { period };
}

export async function getOpenPeriodsAction() {
  const openPeriods = await getOpenPeriods();
  return { openPeriods };
}

export async function closePeriodAction(id: string) {
  const closedPeriod = await closePeriod(id);
  return { closedPeriod };
}

export async function deletePeriodAction(id: string) {
  const deletedPeriod = await deletePeriod(id);
  return { deletedPeriod };
}
