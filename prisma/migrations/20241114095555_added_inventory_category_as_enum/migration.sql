/*
  Warnings:

  - You are about to drop the `InventoryCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `InventoryItem` DROP FOREIGN KEY `InventoryItem_categoryId_fkey`;

-- AlterTable
ALTER TABLE `InventoryItem` ADD COLUMN `category` ENUM('RAW_MATERIALS', 'WORK_IN_PROGRESS', 'FINISHED_GOODS', 'MRO_SUPPLIES', 'CONSUMABLES', 'PACKAGING', 'PERISHABLE_GOODS', 'HIGH_VALUE_ITEMS', 'NON_INVENTORY_ITEMS', 'RETURNED_GOODS', 'REFURBISHED_GOODS', 'HAZARDOUS_MATERIALS', 'SPARE_PARTS', 'OFFICE_SUPPLIES', 'EQUIPMENT', 'ASSETS', 'SERVICE_ITEMS', 'SOFTWARE_LICENSES', 'RENTAL_ITEMS', 'PROMOTIONAL_ITEMS', 'PACKAGING_MATERIALS', 'LAB_SUPPLIES', 'TESTING_EQUIPMENT') NOT NULL;

-- DropTable
DROP TABLE `InventoryCategory`;
