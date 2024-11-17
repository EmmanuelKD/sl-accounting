/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `depreciationMethod` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventoryAccount` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchasePrice` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingPrice` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierContact` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierName` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usefulLife` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `InventoryItem` DROP FOREIGN KEY `InventoryItem_categoryId_fkey`;

-- AlterTable
ALTER TABLE `InventoryItem` ADD COLUMN `depreciationMethod` ENUM('STRAIGHT_LINE', 'DECLINING_BALANCE') NOT NULL,
    ADD COLUMN `inventoryAccount` VARCHAR(191) NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `purchasePrice` DOUBLE NOT NULL,
    ADD COLUMN `quantityInStock` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `sellingPrice` DOUBLE NOT NULL,
    ADD COLUMN `supplierContact` VARCHAR(191) NOT NULL,
    ADD COLUMN `supplierName` VARCHAR(191) NOT NULL,
    ADD COLUMN `usefulLife` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Category`;

-- CreateTable
CREATE TABLE `InventoryCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `InventoryCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `InventoryCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
