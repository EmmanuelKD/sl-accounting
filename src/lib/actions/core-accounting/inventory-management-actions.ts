"use server";

import { createInventoryItem } from "@/module/CoreAccountingModule";
import { InventoryItem } from "@prisma/client";
import { VendorMetadata } from "types";

export async function createInventoryItemAction(data: {
  inventoryItem: Omit<
    InventoryItem,
    "id" | "createdAt" | "updatedAt" | "accountId" | "workspaceId"
  >;
  vendor: VendorMetadata | null;
}, workspaceId: string) {
  return await createInventoryItem(data, workspaceId);
}


// get monthly depreciation by month, default to current month.
//  for all assets you look and calculate the depreciation for the month