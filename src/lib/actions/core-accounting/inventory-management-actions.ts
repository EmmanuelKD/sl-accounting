"use server";
import { createInventoryItem , getInventoryItems } from "@/module/CoreAccountingModule";
import { saveInventoryFile } from "@/utils/files";
import { InventoryItem } from "@prisma/client";
import { VendorMetadata } from "types";
import { v4 as uuidv4 } from "uuid";
export async function createInventoryItemAction(
  data: {
    inventoryImage: FormData;
    inventoryItem: Omit<
      InventoryItem,
      "id" | "createdAt" | "updatedAt" | "accountId" | "workspaceId"
    >;
    isCredit: boolean;
    vendor: VendorMetadata | null;
  },
  workspaceId: string
) {
  const inventoryId = uuidv4();
  //  const inventoryImage = .get("inventory-image") as File;
  const inventoryImagePath = await saveInventoryFile(
    data.inventoryImage,
    data.inventoryItem.name,
    inventoryId
  );

  data.inventoryItem.imgUrl = inventoryImagePath;
  return await createInventoryItem(data, inventoryId, workspaceId);
}

export async function getInventoryItemsAction(workspaceId: string) {
  return await getInventoryItems(workspaceId);
}
// get monthly depreciation by month, default to current month.
//  for all assets you look and calculate the depreciation for the month
