/*
  Warnings:

  - The values [HAZARDOUS_MATERIALS,SERVICE_ITEMS,LAB_SUPPLIES] on the enum `InventoryItem_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropIndex
DROP INDEX `InventoryItem_categoryId_fkey` ON `InventoryItem`;

-- AlterTable
ALTER TABLE `InventoryItem` MODIFY `category` ENUM('RAW_MATERIALS', 'WORK_IN_PROGRESS', 'FINISHED_GOODS', 'MRO_SUPPLIES', 'CONSUMABLES', 'PACKAGING', 'PERISHABLE_GOODS', 'HIGH_VALUE_ITEMS', 'NON_INVENTORY_ITEMS', 'RETURNED_GOODS', 'REFURBISHED_GOODS', 'SPARE_PARTS', 'OFFICE_SUPPLIES', 'EQUIPMENT', 'ASSETS', 'SOFTWARE_LICENSES', 'RENTAL_ITEMS', 'PROMOTIONAL_ITEMS', 'PACKAGING_MATERIALS', 'TESTING_EQUIPMENT') NOT NULL;
