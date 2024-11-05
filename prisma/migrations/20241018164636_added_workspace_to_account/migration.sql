/*
  Warnings:

  - Added the required column `workspaceId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Account` ADD COLUMN `workspaceId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `JournalEntry` ADD COLUMN `workspaceId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `workspaceId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalEntry` ADD CONSTRAINT `JournalEntry_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
