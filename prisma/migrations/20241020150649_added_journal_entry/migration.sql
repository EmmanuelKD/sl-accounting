/*
  Warnings:

  - You are about to drop the column `accountId` on the `JournalEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[relatedTransactionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceId` to the `Period` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `JournalEntry` DROP FOREIGN KEY `JournalEntry_accountId_fkey`;

-- AlterTable
ALTER TABLE `JournalEntry` DROP COLUMN `accountId`;

-- AlterTable
ALTER TABLE `Period` ADD COLUMN `workspaceId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `note` VARCHAR(191) NOT NULL,
    ADD COLUMN `relatedTransactionId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Reimbursement` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `journalEntryId` VARCHAR(191) NULL,
    `workspaceId` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Transaction_relatedTransactionId_key` ON `Transaction`(`relatedTransactionId`);

-- AddForeignKey
ALTER TABLE `Period` ADD CONSTRAINT `Period_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reimbursement` ADD CONSTRAINT `Reimbursement_journalEntryId_fkey` FOREIGN KEY (`journalEntryId`) REFERENCES `JournalEntry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reimbursement` ADD CONSTRAINT `Reimbursement_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reimbursement` ADD CONSTRAINT `Reimbursement_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reimbursement` ADD CONSTRAINT `Reimbursement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
