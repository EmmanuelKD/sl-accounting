/*
  Warnings:

  - Added the required column `dateOfPurchase` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `InventoryItem` ADD COLUMN `dateOfPurchase` DATETIME(3) NOT NULL,
    ADD COLUMN `expirationDate` DATETIME(3) NOT NULL;
