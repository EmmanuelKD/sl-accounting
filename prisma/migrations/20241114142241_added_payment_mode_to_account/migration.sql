/*
  Warnings:

  - Added the required column `paymentMode` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `InventoryItem` ADD COLUMN `paymentMode` ENUM('BANK_TRANSFER', 'CASH', 'CHEQUE', 'MOBILE_PAYMENT') NOT NULL;
