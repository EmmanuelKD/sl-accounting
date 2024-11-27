/*
  Warnings:

  - You are about to drop the column `balance` on the `AccountsPayable` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AccountsPayable` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AccountsPayable` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `AccountsReceivable` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AccountsReceivable` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AccountsReceivable` table. All the data in the column will be lost.
  - You are about to drop the `APTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ARTransaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `AccountsPayable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `AccountsReceivable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountType` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `APTransaction` DROP FOREIGN KEY `APTransaction_accountsPayableId_fkey`;

-- DropForeignKey
ALTER TABLE `ARTransaction` DROP FOREIGN KEY `ARTransaction_accountsReceivableId_fkey`;

-- DropForeignKey
ALTER TABLE `AccountsReceivable` DROP FOREIGN KEY `AccountsReceivable_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_accountId_fkey`;

-- AlterTable
ALTER TABLE `AccountsPayable` DROP COLUMN `balance`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `accountId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `AccountsReceivable` DROP COLUMN `balance`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `accountId` VARCHAR(191) NOT NULL,
    MODIFY `workspaceId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `accountType` ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE', 'CONTRA_ASSET') NOT NULL,
    MODIFY `accountId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `APTransaction`;

-- DropTable
DROP TABLE `ARTransaction`;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountsReceivable` ADD CONSTRAINT `AccountsReceivable_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountsReceivable` ADD CONSTRAINT `AccountsReceivable_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountsPayable` ADD CONSTRAINT `AccountsPayable_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
